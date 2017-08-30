<?php
function image_sizes() {
  add_image_size('gallery-small',  768, 999999);
  add_image_size('gallery-medium', 1400, 999999);
  add_image_size('gallery-medium-large', 2560, 999999);
}
add_action('init', 'image_sizes');