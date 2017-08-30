<?php
function disney_image_sizes() {
  add_image_size('gallery-small',  768, 390);
  add_image_size('gallery-medium', 1400, 999999);
  add_image_size('gallery-medium-large', 2560, 999999);
}
add_action('init', 'disney_image_sizes');