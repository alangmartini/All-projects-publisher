<a name="readme-top"></a>

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">Automatic Trybe Project Publisher</h3>

  <p align="center">
    BR:
    <br />
      Lê quais projetos estão disponíveis no GitHub da sua turma
      e te permite selecionar quais você gostaria de publicar no seu Github pessoal.
      Utiliza o já existente Trybe Publisher disponível para alunos da Trybe.
    <br />
    ENG:
    <br />
        Project made for students at Trybe to easily publish project made while doing the course.
    <br />
    <br />
    <a href="https://github.com/alangmartini/All-projects-publisher">View Demo</a>
    ·
    <a href="https://github.com/alangmartini/All-projects-publisher/issues">Report Bug</a>
    ·
    <a href="https://github.com/alangmartini/All-projects-publisher/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
<h3 align="center">Automatic Trybe Project Publisher</h3>
    <br />
<div align="center">
    <h5 align="left">BR:</h5>
      Lê quais projetos estão disponíveis no GitHub da sua turma
      e te permite selecionar quais você gostaria de publicar no seu Github pessoal.
      Utiliza o já existente Trybe Publisher disponível para alunos da Trybe.
    <h5 align="left">ENG:</h5>
        Project made for students at Trybe to easily publish project made while doing the course.
</div>
<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
Dica: quer não ter que confirmar para cada repositório? Entre no arquivo
```trybe-publisher``` em ```/usr/local/bin``` e delete a linha 194 e 197:

```
194: read -p "Tem certeza que deseja prosseguir? (N/s)" -n 1 -r
197: [[ ! $REPLY =~ ^[Ss]$ ]] && TrybeWarn "Entendido! Nada será feito :)" && exit 1
```

Para utilizar o script você simplesmente executa ele com o node ou code runner após instalar todas as dependências. Responda as perguntas e ele subirá todos os repositórios. Caso queira deixar
100% automático, siga a dica.

O script funciona realizando uma query para a API do GitHub
e pegando todos os projetos da turma atual. E então, para cada
projeto selecionado ele faz outra query para ver qual PR o usuário é criador e pega o nome da branch, de forma a suprir ao Trybe Publisher, que faz o restante do trabalho. O script também clona o repositório, adiciona um novo README e exclui o repositório, para facilitar ainda mais o trabalho.


!!! Importante !!!

Como o Trybe Publisher pega as suas branches da partir do PR, você necessariamente precisa ter aberto pelo menos um PR no projeto. Se você tentar subir um projeto que você não fez com ele, vai dar erro!

### Prerequisites
Como esse script apenas roda o Trybe Publisher para os projetos escolhidos, todos os prerequisitos do Trybe Publisher são 
necessário aqui também!

Portanto, você precisará:

* [Github CLI](https://cli.github.com/manual/) configurado (autenticado).
* [Trybe Publisher](https://github.com/tryber/student-repo-publisher) instalado
* Npm

### Installation
Dica: quer não ter que confirmar para cada repositório? Entre no arquivo
```trybe-publisher``` em ```/usr/local/bin``` e delete a linha 194 e 197:

```
194: read -p "Tem certeza que deseja prosseguir? (N/s)" -n 1 -r
197: [[ ! $REPLY =~ ^[Ss]$ ]] && TrybeWarn "Entendido! Nada será feito :)" && exit 1
```

1. Clone o repositório
2. No root instale as dependências:

   ```sh
   npm install
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Rode o script com:
```sh
node main.mjs
```

E follow the beacon. Execute o script após instalar os pré-requisitos
e dar um npm install, e leia com atenção as mensagens. Sem segredo.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TODO -->
## TODO

1. Quando o projeto for em grupo, achar automaticamente em qual grupo o estudante está e clonar a "main-group-xx"
2. Caso algum projeto dê erro, siga em frente e logue no final do script.
3. Ver quem está de recuperação ainda
4. Criar um front ou GUI para facilitar
<!-- CONTACT -->
## Contact

Alan Martini - gmartinialan@gmail.com

Project Link: [https://github.com/alangmartini/All-projects-publisher](https://github.com/alangmartini/All-projects-publisher)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/alangmartini/All-projects-publisher.svg?style=for-the-badge
[contributors-url]: https://github.com/alangmartini/All-projects-publisher/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/alangmartini/All-projects-publisher.svg?style=for-the-badge
[forks-url]: https://github.com/alangmartini/All-projects-publisher/network/members
[stars-shield]: https://img.shields.io/github/stars/alangmartini/All-projects-publisher.svg?style=for-the-badge
[stars-url]: https://github.com/alangmartini/All-projects-publisher/stargazers
[issues-shield]: https://img.shields.io/github/issues/alangmartini/All-projects-publisher.svg?style=for-the-badge
[issues-url]: https://github.com/alangmartini/All-projects-publisher/issues
[license-shield]: https://img.shields.io/github/license/alangmartini/All-projects-publisher.svg?style=for-the-badge
[license-url]: https://github.com/alangmartini/All-projects-publisher/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/alangmartini
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/Javascript-35495E?style=for-the-badge&logo=js&logoColor=4FC08D
[Next-url]: https://www.javascript.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Javascript-35495E?style=for-the-badge&logo=js&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
