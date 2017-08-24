<?php
function localize() {
  $template_path = get_stylesheet_directory_uri();
  $localize_arr = [
    'basePathURL' => get_bloginfo('wpurl'),
    'templateURL' => $template_path
  ];
  wp_register_script('localize', $template_path.'/js/localize.js');
  wp_enqueue_script('localize');
  wp_localize_script( 'localize', 'wplocal', $localize_arr );
}
add_action('wp_enqueue_scripts', 'localize');  

function twentysixteen_scripts() {
  $templateURL = get_stylesheet_directory_uri();
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
    ['localize'],
    '1.0.0',
    true
  );

  // wp_localize_script(
  //   'matheus-twentysixteen-script',
  //   'wplocal',
  //   array(
  //     'basePathURL' => site_url(),
  //     'templateURL' => $templateURL
  //   )
  // );
}
add_action( 'wp_enqueue_scripts', 'twentysixteen_scripts' );

function admin_scripts() {
  wp_enqueue_style(
    'admin_style',
    get_template_directory_uri().'/css/admin-style.css'
  );
}
add_action( 'admin_enqueue_scripts', 'admin_scripts' );