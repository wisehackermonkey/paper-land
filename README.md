# Paper Playground 

[![Documentation](https://img.shields.io/badge/documentation-website-yellow?logo=markdown&logoColor=yellow)](https://phetsims.github.io/paper-land/)
[![Matrix Server](https://img.shields.io/badge/matrix-chat-green?logo=matrix&logoColor=green)](https://matrix.to/#/#interactive-paper-programming:matrix.org)
[![Youtube Channel](https://img.shields.io/badge/youtube-channel-red?logo=youtube&logoColor=red)](https://www.youtube.com/@PaperPlaygroundCommunity/)
[![License](https://img.shields.io/github/license/phetsims/paper-land?color=blue)](./LICENSE)

![logo](docs/assets/hand-with-dots.png)

## Interactive Play Meets Multimodal Web Experience

Paper Playground is an open-source project for collaboratively creating multimodal web experiences by means of mapping JavaScript* code to real pieces of paper and manipulating the code in your **physical space**.

(*written directly or using a no/low-code component-style interface!)

**We aim to support a community interested in bringing physical interaction as a means to collaboratively solve problems in codesigning virtual technology**.

Paper Playground is based on the [Paper Programs](https://paperprograms.org) open-source project and has been extended to incorporate the library stack used by [PhET Interactive Simulations](https://www.github.com/phetsims/community) as a convenient 2D scene creator and manager. The project focuses on enabling quick prototyping of web projects, with a particular emphasis on easy addition of audio features (like sounds and sonifications), speech description (both TTS engines and screen reader-like descriptions), and other non-visual features that are often difficult to design and develop alongside visual elements in these projects.

The ideas behind Paper Playground are simple, but the possibilities are infinite. 

1. Create programs, as many as you would like, to represent your project.
2. Map data variables, parameters, and functions to paper position, size, shape, rotation, proximity, and use optional marker positions for more functionality.
3. Print out the dot-covered papers that belong to those programs. 
4. Put those *paper programs* in front of a webcam. 
5. Watch and interact with the output of that code in your browser. 
6. Move programs around and trigger the mappings between your papers position in space and your code!
7. Change your program code, make new papers, and keep the creativity going!

![Paper Playground setup detecting paper programs that create a moon lander and control vertical thrust](/docs/assets/full-interface.png)

## Installation

See the [Paper Playground Docs website](https://phetsims.github.io/paper-land/setup/install/) for the most up to date installation instructions.

![Paper Playground setup detecting paper programs that create a moon lander and control vertical position](/www/web-assets/lunar-lander-craft.gif)

## What is coming?

Our team is focused on a few large initiatives for integrating other projects into Paper Playground and for making it more friendly for non-technical, non-JavaScript users and designers. 

⭐ If these projects interest you, please [join our community](https://phetsims.github.io/paper-land/community/) and take part in the development and discussion!

1. :unlock: Creator Interface: Abstracting the JavaScript code through means of a no/low-code component style interface that assembles the data components of your programs and highlights the relationships between your programs (e.g., At a quick glance, what information is needed and passed between programs?). **Check out our progress by opening the Creator page in the tool!**
2. :robot: AI Support: Using LLMs to support a user answer the question: "How do I turn my idea for a multimodal interactive into data variables, functions, and entire programs?". **We are working toward this goal by adding an optional AI assistant inside the Creator page to help generate custom JavaScript code for more complex functions!**
3. :outbox_tray: Easier API integration for paper programs to control or output to other browser displays (besides our [scenery](https://github.com/phetsims/scenery)-focused Display and the legacy canvas-focused Projector), as well as new inputs such as microcontroller integration via Bluetooth and WebSockets. See our [example with the Weavly educational coding project](https://youtu.be/eZo0asFXJz4?si=xiexw7O04gPZW_Sc)!

However, there are **many other areas** that the project can be expanded (see Community below for Contributing guidelines and suggestions)!

## :earth_asia::earth_americas::earth_africa: [Join our Community!](https://phetsims.github.io/paper-land/community/) :earth_asia::earth_americas::earth_africa:

## :clipboard: Roadmap

### Docs
:books:  Updated setup and tutorial!

### Tool
:page_with_curl:  More examples in the hosted database highlighting the power of multimodal design!

:computer:  A UI for creating basic Papers without deep JavaScript knowledge!

:robot: Investigating use of LLMs to help users go from ideas to your suite of paper programs!

## License

This software is licensed under the MIT license. For more information, see the [LICENSE](https://github.com/phetsims/paper-land/blob/main/LICENSE) file.

## Acknowledgments

This tool was adapted from [Paper Programs](https://paperprograms.org/) by JP Posma, which was inspired by the work at [Dynamicland](https://dynamicland.org).
