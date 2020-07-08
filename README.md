# <a href="https://jaehyuk-lee.com/animated-image-histogram/"><img src="./assets/favicon.png" alt="Histogram Logo" title="Go to Animated Image Histogram" height="55" align="center"></a> Animated Image Histogram

**[Animated Image Histogram](https://jaehyuk-lee.com/animated-image-histogram/ "Go to Animated Image Histogram")** creates an animation of the transition between a digital image and its [image histogram](https://en.wikipedia.org/wiki/Image_histogram).

Using only JavaScript and the HTML5 canvas API, I replotted each pixel of an image using its lightness value in the HSL color space as its new X-Coordinate. The pixels with similar lightness values were "stacked up" parallel to the Y-Axis to represent relative frequency. Then, the transition was animated using an interpolation function.

I packaged it with an intuitive interface that allows users to customize their animation by adjusting various animation parameters such as the number of pixels processed, the number of "lightness buckets" to divide the histogram into, the duration of the animation loop, and the background color. Users can also capture stills and videos of their animations.

## Demo Gifs

![Demo gif](./assets/demo1.gif)

![Example result 4](./assets/example_results/g4.gif)

![Example result 3](./assets/example_results/g3.gif)

## Future Directions
* Incorporate WebGL for a more smooth animation and the ability to process higher resolutions.

## Contact
Created by [Jaehyuk Lee](mailto:jhlumd@gmail.com) based on [Anvaka](https://github.com/anvaka/gauss-distribution)'s Reddit post - feel free to contact me!