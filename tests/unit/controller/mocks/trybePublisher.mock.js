const trybePublisherMock = `
#!/bin/bash

#-----Códigos ANSI para cores no terminal-------

BR='\\n'
TAB='\\t'
RED='\\033[0;31m'    #error
CYAN='\\033[0;36m'   #info
GREEN='\\033[0;32m'  #success
YELLOW='\\033[1;33m' #warn
NO_COLOR='\\033[0m'
echo -e "\\\${NO_COLOR}" &> /dev/null

#-----Função para ajuda com uso da ferramenta-------

Help()
{
   # Display Help
   echo -e "*******************************************************************"
   echo -e "Ferramenta para limpeza e publicação de projetos feitos na \${GREEN}Trybe\${NO_COLOR} \${BR}"
   echo -e "Sintaxe: \${GREEN}trybe-publisher \${YELLOW}[-b | -p | -r | -d | -h | --private]\${NO_COLOR}"
   echo -e "Exemplo: \${GREEN}trybe-publisher \${RED}-b\${NO_COLOR} mike-wozowski-project-zoo-functions \${RED}-p\${NO_COLOR} zoo-functions \${YELLOW}--private\${NO_COLOR}\${BR}"
   echo -e "Flags (com \${RED}*\${NO_COLOR} são \${RED}obrigatórias\${NO_COLOR}):"
   echo -e "  \${RED}-b\${NO_COLOR}(branch)         \${RED}*\${NO_COLOR} Nome da sua branch no repositório original (ex: mike-wozowski-project-zoo-functions)"
   echo -e "  \${RED}-p\${NO_COLOR}(projeto)        \${RED}*\${NO_COLOR} Nome do novo repositório que será criado em seu GitHub"
   echo -e "  \${YELLOW}-r\${NO_COLOR}(remote novo)      Nome do novo remote (padrão: origin)" 
   echo -e "  \${YELLOW}-d\${NO_COLOR}(descrição)        Descrição do projeto em seu repositório (padrão: vazio)"
   echo -e "  \${YELLOW}-h\${NO_COLOR}(help)             Mostra esta mensagem de ajuda"
   echo -e "  \${YELLOW}--private\${NO_COLOR}            Define o novo repositório como privado (padrão: público)"
   echo -e "  \${YELLOW}--custom-readme\${NO_COLOR}      Utiliza o README definido em ~/.student-repo-publisher/custom/_NEW_README.md\${BR}"
   echo -e "*******************************************************************"
   exit 0
}

#-----Funções para padronizar mensagens-------

TrybeInfo()
{
    echo -e "\${CYAN}INFO>>\${TAB}\${NO_COLOR}$1\${NO_COLOR}"
}

TrybeSuccess()
{
    echo -e "\${GREEN}OK<3\${TAB}\${NO_COLOR}$1\${NO_COLOR}"
}

TrybeWarn()
{
    echo -e "\${YELLOW}WARN##\${TAB}\${NO_COLOR}$1\${NO_COLOR}"
}

TrybeError()
{
    echo -e "\${RED}ERROR!!\${TAB}\${NO_COLOR}$1\${NO_COLOR}"
}

#-----Recupera e define parâmetros-------

REPO_PRIVATE=false
CUSTOM_README=false

# ref --args: https://stackoverflow.com/a/7680682/12763774
allopts="hb:p:r:d:-:"
while getopts "$allopts" option;
do
    case "\${option}"
        in
            -)
                case "\${OPTARG}" in
                    private) REPO_PRIVATE=true;;
                    custom-readme) CUSTOM_README=true;;
                    *)
                        if [ "$OPTERR" = 1 ] && [ "\${allopts:0:1}" != ":" ]; then
                            TrybeError "Comando inválido: \${RED}--\${OPTARG}\${NO_COLOR}" >&2 && exit 1
                        fi
                        ;;
                esac;;
            h) Help;;
            b) USER_BRANCH=\${OPTARG};;
            p) REPO_NAME=\${OPTARG};;
            r) REMOTE_NAME=\${OPTARG};;
            d) DESCR=\${OPTARG};;
            \?) echo "" && Help && exit 1;;
    esac
done

# define o valor padrão para o parâmetro '-r' 
[[ -z $REMOTE_NAME ]] && REMOTE_NAME="project-temp-remote-name"

#-----Verificações iniciais-------

# verifica se a pessoa possui o gh-cli
if ! [[ -x $(command -v gh) ]] || ! gh auth status >/dev/null 2>&1; # ref https://stackoverflow.com/a/73465507/12763774
then
    TrybeError "Você precisa da ferramenta \${RED}github-cli(gh)\${NO_COLOR} instalada e autenticada na sua conta para continuar."
    exit 1
fi

# verifica se possui o git-filter-repo
if ! [[ -x $(command -v git-filter-repo) ]];
then
    read -p "Você deseja executar a instalação do git-filter-repo? (S/n)" -n 1 -r
    [[ $REPLY =~ ^[Nn]$ ]] && TrybeWarn "Tudo bem, encerrando sem fazer nada!" && exit 1
    gh repo clone newren/git-filter-repo
    MV_RESULT=$(sudo mv git-filter-repo/git-filter-repo /usr/local/bin && echo ok)
    [[ "$MV_RESULT" != "ok" ]] && sudo mkdir /usr/local/bin && sudo mv git-filter-repo/git-filter-repo /usr/local/bin
    rm -rf git-filter-repo
    TrybeSuccess "Dependência \${GREEN}git-filter-repo\${NO_COLOR} instalada com sucesso!"
fi

# verifica se os parâmetros de 'branch' e 'novo repositório' foram definindos 
if [[ -z $USER_BRANCH ]] || [[ -z $REPO_NAME ]]; then
    TrybeError "Os parâmetros \${RED}-b\${NO_COLOR} 'nome_na_branch' e \${RED}-p\${NO_COLOR} 'nome_do_novo_repositorio' são obrigatórios."
    exit 1
fi

if [[ $REPO_NAME = *" "* ]]; then
    TrybeError "O nome \${RED} '$REPO_NAME'\${NO_COLOR} escolhido para o novo repositório não pode conter espaços."
    exit 1
fi

# verifica se repositório desejado já existe

SAME_NAME_REPO=$(gh repo list --json 'name' -q '.[].name' -L 1000 | grep -i "^\${REPO_NAME}$")
if [[ $SAME_NAME_REPO ]]; then
    TrybeError "O nome \${RED}'$REPO_NAME'\${NO_COLOR} escolhido para o novo repositório já está em uso."
    exit 1
fi

GH_USERNAME=$(gh api user -q '.login')

# verifica se a pasta atual é um repositório git da trybe com origin apontando para o tryber
IS_GIT_REPO=$(git rev-parse --is-inside-work-tree)
IS_ORIGIN_TRYBE_REMOTE=$(git remote get-url origin | grep "tryber" || false)
if [[ ! $IS_GIT_REPO || ! $IS_ORIGIN_TRYBE_REMOTE ]]; 
then 
    TrybeError "Você precisa estar em uma pasta com repositório git de um projeto da Trybe para iniciar a ferramenta."
    exit 1
fi

#-----Script start--------

current_repo=\${IS_ORIGIN_TRYBE_REMOTE##*/}
current_repo=\${current_repo%.*}
current_project=$(echo "$current_repo" | sed -r 's/(sd-([0-9]{1,3}|xp|t[0-9]{1,2})-([a-z]-)?)(.*)/\\4/')

#-----Define branch que será publicada--------

if [[ $USER_BRANCH == *"group"* ]]; then
  string=$(git branch -a | grep "$USER_BRANCH$") # acha as branches com o nome definido nos parâmetros caso haja "group" no nome
else
  string=$(git branch -a | grep "$USER_BRANCH") # acha as branches com o nome definido nos parâmetros  
fi

BRANCHES=$(echo "$string" | sed -r 's/(remotes\/origin\/)(.*)/\\2/')

if [[ ! $BRANCHES ]] ; then
    TrybeError "O valor informado no parâmetro \${RED}-b\${NO_COLOR} não corresponde a uma branch deste repositório."
    exit 1
fi

# shellcheck disable=SC2207
array=($(echo "$BRANCHES" | tr '\n' '\n')) # quebra a estrutura do git branch -a em um array

if [[ "$OSTYPE" != *"linux"* ]]; then
    TARGET_BRANCH=\${array[$((\${#array[@]} - 1))]} # caso não seja linux ref: https://stackoverflow.com/a/61004126
else
    TARGET_BRANCH=\${array[-1]} # pega o nome da branch (que é o último elemento do array) caso seja linux
fi

#------- Boas-vindas e confirmação de intenção

echo -e "\${GREEN}* * * * * * * * * * * * * * * * * * * *\${NO_COLOR}"
echo    "Boas-vindas à ferramenta de limpeza e"
echo -e "publicação de projetos feitos na \${GREEN}Trybe"
echo -e "* * * * * * * * * * * * * * * * * * * *\${NO_COLOR}"
echo
echo -e "\${RED}NÃO RECOMENDAMOS utilizar essa"
echo "ferramenta ANTES de receber a aprovação"
echo -e "no projeto.\${NO_COLOR}"
echo 
echo -e "Essa ferramenta irá fazer um push da"
echo -e "branch: \${GREEN}\${TARGET_BRANCH}\${NO_COLOR}"
echo -e "do projeto: \${CYAN}\${current_repo}\${NO_COLOR}"
echo 
if $REPO_PRIVATE
then
    echo -e "ao seguinte repositório \${RED}privado\${NO_COLOR} que será"
else
    echo -e "ao seguinte repositório \${RED}público\${NO_COLOR} que será"
fi
echo -e "criado: \${GREEN}https://github.com/\${GH_USERNAME}/\${REPO_NAME}\${NO_COLOR}"
echo
read -p "Tem certeza que deseja prosseguir? (N/s)" -n 1 -r
echo
echo "- - - - - - - - - - - - - - - - - -"
[[ ! $REPLY =~ ^[Ss]$ ]] && TrybeWarn "Entendido! Nada será feito :)" && exit 1

#------- Clona e/ou atualiza o repositório de scripts

SCRIPTS_BASE="$HOME/.student-repo-publisher" &&
if [[ ! -d $SCRIPTS_BASE ]]; then
    TrybeInfo "Obtendo base de configurações de limpeza..."
    git clone git@github.com:tryber/student-repo-publisher.git "$SCRIPTS_BASE" --quiet # clona o repo da trybe com os scripts de limpeza de projeto se não tiver clonado já
else
    TrybeInfo "Atualizando base de configurações de limpeza..."
    CURR_PATH=$(pwd)
    cd "$SCRIPTS_BASE" && git pull origin main --quiet # caso o repositório já exista, sincroniza qualquer atualização
    cd "$CURR_PATH" || exit # retorna para a pasta inicial independente de erro
fi


#------- Entra na branch que será trabalhada

git checkout "$TARGET_BRANCH" --quiet && #dá checkout

#------- Recupera o script correto baseado no projeto atual

if [[ $(find . -type f -name trybe-filter-repo.sh | head -n 1) ]] ; then
    TrybeInfo "A configuração de limpeza para este projeto está disponível!"
else
    if [[ $(find "$SCRIPTS_BASE"/repo-filters-by-project/ -type d -name sd-0x-"$current_project" | head -n 1) ]] ; then
        TrybeInfo "A configuração de limpeza para este projeto foi encontrada no repositório base!"
        cp "$SCRIPTS_BASE"/repo-filters-by-project/sd-0x-"$current_project"/trybe-filter-repo.sh ./
    else
        echo
        TrybeWarn "Não foi encontrada uma configuração de limpeza para o projeto \${YELLOW}\${current_project}\${NO_COLOR}, mas está tudo bem!\${BR}"
        read -p "Você deseja prosseguir, se comprometendo a apagar os arquivos do avaliador da Trybe manualmente? (N/s)" -n 1 -r
        echo
        echo "- - - - - - - - - - - - - - - - - -"
        
        [[ ! $REPLY =~ ^[Ss]$ ]] && TrybeWarn "Tudo bem, encerrando! Nada será feito" && exit 1
        
        cp "$SCRIPTS_BASE"/trybe-filter-repo.sh ./
    fi
    git add trybe-filter-repo.sh && git commit -m "add trybe-filter-repo.sh" --quiet
fi

#-------Backup da pasta antes de realizar o pull ---------

TIME_STAMP=$(date "+%Y-%m-%dT%H:%M:%S")
BACKUP_DIR="\${SCRIPTS_BASE}/.backups/\${current_repo}-\${TIME_STAMP}"

cp -Rf . "$BACKUP_DIR"
TrybeSuccess "Backup do projeto criado em: \${GREEN}$BACKUP_DIR\${NO_COLOR}"

#-------Sincronizando o remoto com o local ------------

HAS_LOCAL_MODS=$(git status --porcelain)
if [[ $HAS_LOCAL_MODS ]]; then
    TrybeError "Existem modificações locais não commitadas pendentes na sua branch, não é possível continuar."
    git status | sed 's/^/GIT:\t/'
    exit 1
fi  

if ! git fetch origin --quiet ; then # não tem acesso ou porque não existe ou porque não tem autorização
    TrybeInfo "A ferramenta usará os arquivos \${CYAN}locais\${NO_COLOR}.\${BR}Obs: isso acontece porque esse repositório não existe ou você não tem autorização para acessá-lo mais."
else
    # se tem acesso ao remote, dá um fetch e verifica se existe diferença entre local/remoto com git diff $branch origin/$branch
    REMOTE_DIFF_STAT=$(git diff --stat "$TARGET_BRANCH" origin/"$TARGET_BRANCH" -- . ':(exclude)trybe-filter-repo.sh')

    if [[ $REMOTE_DIFF_STAT ]]; then
        TrybeWarn "O repositório \${YELLOW}remoto\${NO_COLOR} possui algumas diferenças em relação ao \${CYAN}local\${NO_COLOR}: "
        echo
        echo -e "\${NO_COLOR}$REMOTE_DIFF_STAT\${YELLOW}"
        echo
        read -p "Você deseja atualizar a branch local com as modificações da remota (git pull) ? (N/s)" -n 1 -r
        echo
        echo -e "- - - - - - - - - - - - - - - - - -\${NO_COLOR}"
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            git pull origin "$TARGET_BRANCH" --quiet #pega todas as modificações da branch remota
        else
            echo 
            TrybeInfo "Tudo bem, a ferramenta usará os arquivos \${CYAN}locais\${NO_COLOR}."
        fi
    fi
fi

#------Cria o novo repositório-----------
if $REPO_PRIVATE
then
    NEW_REPO_URL=$(gh repo create "$REPO_NAME" --private --source=. --remote="$REMOTE_NAME" --description="$DESCR")
else
    NEW_REPO_URL=$(gh repo create "$REPO_NAME" --public --source=. --remote="$REMOTE_NAME" --description="$DESCR")
fi

if [[ $NEW_REPO_URL ]]
then
    TrybeSuccess "Repositório criado com sucesso: \${GREEN}\${GH_USERNAME}/\${REPO_NAME}\${NO_COLOR}\${BR}"
else
    TrybeError "Falha ao criar o repositório: \${RED}\${GH_USERNAME}/\${REPO_NAME}\${NO_COLOR}"
    TrybeWarn "As operações de limpeza e push não foram realizadas."
    exit 1
fi

#------Cria os remotes-----------

git remote rename origin trybe # renomeia o remote da Trybe para 'trybe' (para manter de backup)

#-------Executa script de limpeza com git-filter-repo-------

if bash trybe-filter-repo.sh trybe-security-parameter; then
    echo
    TrybeSuccess "Arquivos limpos com sucesso!\${BR}"
else
    echo
    TrybeError "Oooops! Houve algum problema no \${GREEN}'./trybe-filter-repo.sh'\${NO_COLOR}"
    TrybeWarn "A operação de push não foi realizada."
    git remote rename trybe origin
    git remote remove $REMOTE_NAME
    exit 1
fi

rm -f trybe-filter-repo.sh

if [[ $CUSTOM_README == true && -f "$SCRIPTS_BASE/custom/_NEW_README.md" ]]; then
    TrybeInfo "Aplicando README inicial \${YELLOW}customizado\${NO_COLOR}."
    cp "\${SCRIPTS_BASE}"/custom/_NEW_README.md ./README.md
    README_COMMIT_MSG="README custom, em construção 🚧"
else
    TrybeInfo "Aplicando README inicial \${GREEN}padrão Trybe\${NO_COLOR}."
    cp "\${SCRIPTS_BASE}"/_NEW_README.md ./README.md
    README_COMMIT_MSG="README inicial, em construção 🚧"
fi

git add README.md
git commit -m "$README_COMMIT_MSG" --quiet

if git push -u $REMOTE_NAME "$TARGET_BRANCH":main --quiet | sed 's/^/GIT:\t/' ; then
    echo
    TrybeSuccess "Operação de push feita com \${GREEN}sucesso\${NO_COLOR}!"
else
    echo
    TrybeError "Oooops! Houve algum problema no push ao seu remote pessoal"
    exit 1
fi

#-----Atualiza remotes locais------

git remote remove trybe 
if [[ $REMOTE_NAME == "project-temp-remote-name" ]]
then 
    git remote rename $REMOTE_NAME origin
    TrybeInfo "O remote \${CYAN}origin\${NO_COLOR} foi atualizado para o novo repositório."
fi

git branch -m main --force && TrybeInfo "A branch \${CYAN}main\${NO_COLOR} foi sincronizada com novo repositório."

echo 
echo -e "\${GREEN}* * * * * * * * * * * * * * * * * * * *\${NO_COLOR}"
echo -e "Pronto, seu projeto feito na \${GREEN}Trybe\${NO_COLOR} está"
echo "no seu respositório pessoal, e"
echo "sincronizado neste diretório local!"
echo 
echo -e "Acesse aqui: \${CYAN}\${NEW_REPO_URL}\${NO_COLOR}"
echo 
echo -e "Não se esqueça de editar o \${RED}README\${NO_COLOR}"
echo "usando nossas recomendações ;)"
echo -e "\${GREEN}* * * * * * * * * * * * * * * * * * * *\${NO_COLOR}"
`


module.exports = {
    trybePublisherMock,
};