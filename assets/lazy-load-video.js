class LazyLoadVideo extends HTMLElement {
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

  /**
   * Connects the element to the DOM and starts observing it with the IntersectionObserver.
   *
   * @return {void}
   */
  connectedCallback() {
    this._observer.observe(this);
  }

  /**
   * Retrieves and sets the video source for the lazy-loaded video element.
   *
   * @return {void}
   */
  _getVideoSource() {
    if (!this._sources) return;

    this._sources.forEach((source) => {
      source.src = source.dataset.src;
      source.type = source.dataset.type;
    });
  }

  /**
   * Loads the video element when it comes into view.
   *
   * @return {void}
   */
  _loadVideo() {
    const video = this.querySelector("video");
    if (video) {
      this._getVideoSource();
      video.load();
    }
  }
}

customElements.define("lazy-load-video", LazyLoadVideo);
