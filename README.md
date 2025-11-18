<main>
  <header>
    <h1>Project: Theo's Workshop</h1>
  </header>

  <section>
    <h2>Purpose</h2>
    <p>
      This project is meant to showcase frontend modules I've developed - and
      will develop - like a portfolio. It's a project I can work on in my free
      time to inventory my current skills, starting with HTML, CSS, and
      JavaScript, and later transitioning to frameworks
    </p>
    <p>
      It's an SPA hosted on GitHub Pages which dynamically loads components with
      navigation handled by my custom-built navbar. Live version can be found
      <a href="https://theolsson.github.io/" target="_blank">here</a>
    </p>
  </section>

  <section>
    <h2>Goals</h2>
    <ul>
      <li>
        Develop modules with the aim to solidify my current and learn new skills
      </li>
      <li>
        Have a responsive design that works down to a screen width of 320 pixels
      </li>
      <li>Have fun</li>
    </ul>
  </section>

  <section>
    <h2>Current Features</h2>
    <ul>
      <li>
        <h3>Loader</h3>
        <p>
          The core feature of this project, built to load components and modules
        </p>
        <p>
          It is responsible for loading the navbar and home modules on startup
          by fetching the html file and inserting it into index.html, as well as
          creating and appending both a link tag for the CSS file, and a script
          tag for the JavaScript file
        </p>
        <a
          href="https://github.com/theolsson/theolsson.github.io/blob/main/app.js"
          target="_blank"
          >Code in app.js
        </a>
      </li>
      <li>
        <h3>Navbar</h3>
        <p>
          The navbar has two positions based on screen width. Regardless of
          position it has a carousel to navigate between modules via their
          custom icons and an expandable area which displays module names and
          populate itself dynamically with the modules
        </p>
        <p>
          All assets, including the navbar design and interactions, are being
          created from scratch by me, without the use of frameworks or
          templates, relying instead on my own CSS and JavaScript skills to
          build this first component
        </p>
        <a
          href="https://github.com/theolsson/theolsson.github.io/tree/main/components/navbar"
          target="_blank"
          >Code in components/navbar
        </a>
      </li>
      <li>
        <h3>Home page</h3>
        <p>
          A page to welcome visitors as well as explain the project. You are
          currently here
        </p>
        <p>
          This page has intentional minimal styling, as I intend to update it as
          the project moves along - and it in itself is only meant to offer
          information
        </p>
        <a
          href="https://github.com/theolsson/theolsson.github.io/tree/main/modules/home"
          target="_blank"
          >Code in modules/home
        </a>
      </li>
      <li>
        <h3>Clicker</h3>
        <p>
          A basic version of an incremental game, relying on local storage to
          keep track of your score. There might be some more functionality
          accessable to people who play around a bit <s>(or read the source code)</s>
        </p>
        <p>
          I have plans to revisit this in the future to add functionality - but
          for now, it is a simple module made to allow me to populate the navbar
          and show its functionality with more than placeholders
        </p>
        <a
          href="https://github.com/theolsson/theolsson.github.io/tree/main/modules/clicker"
          target="_blank"
          >Code in modules/clicker
        </a>
      </li>
    </ul>
  </section>

  <section>
    <h2>Future Features</h2>
    <ul>
      <li>
        <h3>Minigames</h3>
        <p>
          I intend to make a series of minigames as their own modules. For
          example I intend to develop a <del>button clicker</del>(done), tic tac toe, snake, and
          pong modules
        </p>
      </li>
      <li>
        <h3>Integration with APIs</h3>
        <p>
          I have a collection of APIs which I intend to use to populate data in
          certain modules - my first goal is to make a team builder using
          <a href="https://pokeapi.co/" target="_blank">PokeAPI </a>
        </p>
      </li>
    </ul>
  </section>

  <section>
    <h2>My background</h2>
    <p>
      During the pandemic I needed something to occupy my time, so I decided to
      take a programming course. This was suggested to me by a colleague who had
      seen my usage of Excel to make intricate conditional calculators to help
      me automate my work and guard against errors, first for myself, and then
      for my employer. I discovered I found programming was not only enjoyable,
      but it also felt intuitive
    </p>
    <p>
      The following semester I crunched a math course to be eligible for
      vocational university - in Sweden called
      <a href="https://www.yrkeshogskolan.se/in-english" target="_blank"
        >yrkeshögskola</a
      >. I was accepted and spent 2 years studying to become a web developer,
      which included an internship working as a full-stack developer for
      <a href="https://www.hogia.se/int/" target="_blank">Hogia </a>
    </p>
    <p>
      I am currently seeking a role as a frontend-, backend-, or
      full-stack-developer whilst working as a volunteer. I am also preparing to
      apply to start university in fall 2026 to work my way towards a bachelor's
      degree in computer science or software engineering as a backup plan
      should I not find employment before then
    </p>
  </section>

  <footer>
    <h2>Contact</h2>
    <ul>
      <li>
        <a href="https://github.com/theolsson" target="_blank">GitHub </a>
      </li>
      <li>
        <a
          href="https://www.Linkedin.com/in/theo-olsson-39010921b/?locale=en_US"
          target="_blank"
          >LinkedIn
        </a>
      </li>
    </ul>
    <p id="footer-copyright">© 2025 Theo Olsson. All rights reserved</p>
  </footer>
</main>
