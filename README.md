<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/glynnsanity/bigc-mimic">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">BigC Mimic CLI</h3>

  <p align="center">
    BigC Mimic CLI is a command line interface using ChatGPT to intelligently retrieve data from eCommerce sites and transfer data to BigCommerce storefronts. Currently it's primary use is for the Solutions Engineering team at BigCommerce to ease POC development.
    <br />
    <a href="https://github.com/glynnsanity/bigc-mimic"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/glynnsanity/bigc-mimic">View Demo</a>
    ·
    <a href="https://github.com/glynnsanity/bigc-mimic/issues">Report Bug</a>
    ·
    <a href="https://github.com/glynnsanity/bigc-mimic/issues">Request Feature</a>
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
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://www.nike.com/w/mens-basketball-shoes-3glsmznik1zy7ok)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![BigCommerce]](https://developer.bigcommerce.com/)
* [![Puppeteer]](https://pptr.dev/)
* [![ChatGPT]](https://platform.openai.com/docs/guides/gpt)
* [![NPM Commander]](https://www.npmjs.com/package/commander)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Here's how to get started...

### Prerequisites

Developed on Node v18.15.0. Need to further test compatibilities with node versions.

### Installation

1. Get a Chat GPT API Key at [https://platform.openai.com/docs/guides/gpt](https://platform.openai.com/docs/guides/gpt)
2. Choose a storefront and create an API Key with the following scopes:
    - Create Product
    - Create Categories
    - Create Channel Assignments
3. Clone the repo and cd into the bigc-mimic folder
   ```sh
   git clone https://github.com/glynnsanity/bigc-mimic.git

   cd bigc-mimic
   ```
4. Install packages
   ```sh
   npm install -g
   ```
5. Initiate BigC Mimic config (follow prompts)
   ```sh
   bigc-mimic init
   ```
6. Run a category scan to retrieve product data (follow prompts)
   ```sh
   bigc-mimic catscan
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Add SKU and Stock number generation
- [ ] Experiment with single product page analysis for complex products (bigc-mimic prodscan)
- [ ] Improve CLI experience

See the [open issues](https://github.com/glynnsanity/bigc-mimic/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

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



<!-- CONTACT -->
## Contact

Glynn Jordan - [LinkedIn]([linkedin_url]) - glynn.jordan@bigcommerce.com

Project Link: [https://github.com/glynnsanity/bigc-mimic](https://github.com/glynnsanity/bigc-mimic)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/glynnsanity/bigc-mimic.svg?style=for-the-badge
[contributors-url]: https://github.com/glynnsanity/bigc-mimic/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/glynnsanity/bigc-mimic.svg?style=for-the-badge
[forks-url]: https://github.com/glynnsanity/bigc-mimic/network/members
[stars-shield]: https://img.shields.io/github/stars/glynnsanity/bigc-mimic.svg?style=for-the-badge
[stars-url]: https://github.com/glynnsanity/bigc-mimic/stargazers
[issues-shield]: https://img.shields.io/github/issues/glynnsanity/bigc-mimic.svg?style=for-the-badge
[issues-url]: https://github.com/glynnsanity/bigc-mimic/issues
[license-shield]: https://img.shields.io/github/license/glynnsanity/bigc-mimic.svg?style=for-the-badge
[license-url]: https://github.com/glynnsanity/bigc-mimic/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/glynnjordan
[product-screenshot]: images/screenshot2.png


[Puppeteer]: https://img.shields.io/badge/Puppeteer-40B5A4?logo=puppeteer&logoColor=fff&style=for-the-badge
[BigCommerce]: https://img.shields.io/badge/BigCommerce-121118?logo=bigcommerce&logoColor=fff&style=for-the-badge
[ChatGPT]: https://img.shields.io/badge/chatGPT-74aa9c?style=for-the-badge&logo=openai&logoColor=white
[NPM Commander]: https://img.shields.io/badge/NPM-Commander-red?style=for-the-badge&labelColor=black