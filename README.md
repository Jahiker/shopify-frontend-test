# Shopify Frontend Test

Technical test for frontend developer position

Author: Jahiker Rojas - 
https://jahiker.github.io/jahiker/

## Store preview

Store: <https://jr-dev-shop.myshopify.com/>

Password: devstore

## Github repo

<https://github.com/Jahiker/shopify-frontend-test>

## Lazy Load Video Feature

### How it works

First of all, I added 2 new settings for the section (At the end of the home page you can find the Image with text sections added):
- one for select the media type you want to use in the sections, so in this way you can load an image or a video.
- Second for the option to load a video.

```liquid
{
    "type": "select",
    "id": "media_type",
    "label": "t:sections.image-with-text.settings.media_type.label",
    "options": [
        {
            "value": "image",
            "label": "t:sections.image-with-text.settings.media_type.image"
        },
        {
            "value": "video",
            "label": "t:sections.image-with-text.settings.media_type.video"
        }
    ],
    "default": "image"
},
{
    "type": "image_picker",
    "id": "image",
    "label": "t:sections.image-with-text.settings.image.label"
},
{
    "type": "video",
    "id": "video",
    "label": "t:sections.image-with-text.settings.video.label"
},
```
https://github.com/Jahiker/shopify-frontend-test/blob/main/sections/image-with-text.liquid

For lazy load video I created a web component that is loaded on the theme.liquid file only if the layout contains a component that use it

```html
{% if content_for_layout contains 'lazy-load-video' %}
    <script src="{{ 'lazy-load-video.js' | asset_url }}" defer="defer"></script>
{% endif %}
```
https://github.com/Jahiker/shopify-frontend-test/blob/main/layout/theme.liquid


Then for the web component I decide to use the Intersection Observer API, so in this way I make sure that we only load the video if it's intercepted by the viewport

```javascript
  constructor() {
    super();

    // Get all sources
    this._sources = this.querySelectorAll("source");

    // Create an IntersectionObserver instance
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this._loadVideo();
          this._observer.unobserve(this);
        }
      });
    });

    this._getVideoSource();
  }
```
https://github.com/Jahiker/shopify-frontend-test/blob/main/assets/lazy-load-video.js


### How the Web Component get the video assets

In order to get the video source and the video type, I pass through all the data as an element dataset, in this way we make sure no to load de video until the moment we require it.

```html
{% if section.settings.video != null %}
    <lazy-load-video>
        <video
            loop="false"
            muted="true"
            autoplay="autoplay"
            style="object-fit:cover; width: 100%; height: 100%;"
        >
            {%- for source in section.settings.video.sources -%}
                <source data-src="{{ source.url }}" data-type="{{ source.mime_type }}">
            {%- endfor -%}
        </video>
    </lazy-load-video>
{% endif %}
```
https://github.com/Jahiker/shopify-frontend-test/blob/main/sections/image-with-text.liquid


```javascript
  _getVideoSource() {
    if (!this._sources) return;

    this._sources.forEach((source) => {
      source.src = source.dataset.src;
      source.type = source.dataset.type;
    });
  }
```
https://github.com/Jahiker/shopify-frontend-test/blob/main/assets/lazy-load-video.js

## Suggestions and potentials improvements:

- Minyfy all the javascript and css before to deploy a new feature, in this way we can reduce the load size for the store.
- Coditional load for the assets, as I did on the theme.liquid with the lazy-load-video.js asset, in this way we make sure not to load an assets more then once and not to load it if we don't need it.
- add defer or asyn load for all the javascript.
- Load images on web optimized format like webp.
- Use lazy load technique for loading all the media assets.