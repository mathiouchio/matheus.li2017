<?php
/**
 * Enqueues scripts and styles.
 * @since Twenty Sixteen 1.0
 */

add_theme_support( 'post-thumbnails' );

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
    // $templateURL.'/js/scripts.min.js',
    $templateURL.'/js/scripts-debug.js',
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

// PORTFOLIO custom post type
add_action( 'init', 'create_post_type' );
function create_post_type() {
  register_post_type( 'portfolio',
    array(
      'labels' => array(
        'name' => __( 'Portfolio' ),
        'singular_name' => __( 'Porfolio' )
      ),
      'public' => true,
      'publicly_queryable' => true,
      'show_in_rest' => true,
      'rest_base' => 'portfolio',
      'has_archive' => false,
      'supports' => array(
        'title',
        'editor',
        'author',
        'thumbnail',
        'post-formats'
      ),
      'rewrite' => array(
        'slug' => false,
        'with_front' => false
      )
    )
  );
}

/* show acf fields on wp rest api @davidmaneuver:
 * https://gist.github.com/rileypaulsen/9b4505cdd0ac88d5ef51
 * reference: http://v2.wp-api.org/extending/modifying/
 */
function wp_rest_api_alter() {
  register_api_field( 'portfolio',
      'fields',
      array(
        'get_callback'    => function($data, $field, $request, $type){
          if (function_exists('get_fields')) {
            return get_fields($data['id']);
          }
          return [];
        },
        'update_callback' => null,
        'schema'          => null,
      )
  );
  register_api_field( 'post',
      'fields',
      array(
        'get_callback'    => function($data, $field, $request, $type){
          if (function_exists('get_fields')) {
            return get_fields($data['id']);
          }
          return [];
        },
        'update_callback' => null,
        'schema'          => null,
      )
  );
}
add_action( 'rest_api_init', 'wp_rest_api_alter');

/* Redirect 404 to homepage */
add_action( 'pre_get_posts', 'wpse44983_single_post_404' );
function wpse44983_single_post_404( $query ) {
  if ( $query->is_main_query() && $query->is_single() ) {
    $query->is_404 = true;
  }
}

/* Adding post format support to custom-post-type */
add_theme_support('post-formats', array('video','gallery'));
add_post_type_support( 'portfolio', 'post-formats' );

/**
 * Register the required plugins for this theme.
 *
 * In this example, we register five plugins:
 * - one included with the TGMPA library
 * - two from an external source, one from an arbitrary source, one from a GitHub repository
 * - two from the .org repo, where one demonstrates the use of the `is_callable` argument
 *
 * The variables passed to the `tgmpa()` function should be:
 * - an array of plugin arrays;
 * - optionally a configuration array.
 * If you are not changing anything in the configuration array, you can remove the array and remove the
 * variable from the function call: `tgmpa( $plugins );`.
 * In that case, the TGMPA default settings will be used.
 *
 * This function is hooked into `tgmpa_register`, which is fired on the WP `init` action on priority 10.
 */
require_once 'class-tgm-plugin-activation.php';
add_action( 'tgmpa_register', 'matheusli_register_required_plugins' );

function matheusli_register_required_plugins() {
  $plugins = array(
    array(
      'name'      => 'WP REST API',
      'slug'      => 'rest-api',
      'required'  => true,
    ),
    array(
      'name'      => 'Better REST API Featured Images',
      'slug'      => 'better-rest-api-featured-images',
      'required'  => true,
    )
  );

  $config = array(
    'id'           => 'matheusli',
    'default_path' => '',
    'menu'         => 'tgmpa-install-plugins',
    'parent_slug'  => 'themes.php',
    'capability'   => 'edit_theme_options',
    'has_notices'  => true,
    'dismissable'  => true,
    'dismiss_msg'  => '',
    'is_automatic' => false,
    'message'      => '',
  );

  tgmpa( $plugins, $config );
}