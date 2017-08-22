<?php
function twentysixteen_scripts() {
  $templateURL = get_template_directory_uri();

  wp_enqueue_style(
    'matheus-twentyseventeen',
    $templateURL.'/style.css'
  );

  // deregister
  wp_deregister_script('jquery');

  // concatenated all scripts
  wp_enqueue_script(
    'matheus-twentysixteen-script',
    $templateURL.'/js/scripts.min.js',
    // $templateURL.'/js/scripts-debug.js',
    array(),
    '1.0.0',
    true
  );

  wp_localize_script(
    'matheus-twentysixteen-script',
    'wplocal',
    array(
      'basePathURL' => site_url(),
      'templateURL' => get_template_directory_uri()
    )
  );
}
add_action( 'wp_enqueue_scripts', 'twentysixteen_scripts' );