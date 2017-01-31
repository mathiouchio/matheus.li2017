<?php
/**
 * Enqueues scripts and styles.
 *
 * @since Twenty Sixteen 1.0
 */
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
    // $templateURL.'/js/min/scripts.min.js',
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

// custom post type
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

add_action( 'pre_get_posts', 'wpse44983_single_post_404' );
function wpse44983_single_post_404( $query ) {
    $home_url = get_home_url();
    if ( $query->is_main_query() && $query->is_single() ) {
      $query->is_404 = true;
      // $query->is_page = 'home';
      // wp_redirect( home_url(), 301 );
      // exit;
    }
}


require_once 'class-tgm-plugin-activation.php';

add_action( 'tgmpa_register', 'matheusli_register_required_plugins' );


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
function matheusli_register_required_plugins() {

  $plugins = array(
    // This is an example of how to include a plugin from the WordPress Plugin Repository.
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

  /*
   * Array of configuration settings. Amend each line as needed.
   *
   * TGMPA will start providing localized text strings soon. If you already have translations of our standard
   * strings available, please help us make TGMPA even better by giving us access to these translations or by
   * sending in a pull-request with .po file(s) with the translations.
   *
   * Only uncomment the strings in the config array if you want to customize the strings.
   */
  $config = array(
    'id'           => 'matheusli',                 // Unique ID for hashing notices for multiple instances of TGMPA.
    'default_path' => '',                      // Default absolute path to bundled plugins.
    'menu'         => 'tgmpa-install-plugins', // Menu slug.
    'parent_slug'  => 'themes.php',            // Parent menu slug.
    'capability'   => 'edit_theme_options',    // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
    'has_notices'  => true,                    // Show admin notices or not.
    'dismissable'  => true,                    // If false, a user cannot dismiss the nag message.
    'dismiss_msg'  => '',                      // If 'dismissable' is false, this message will be output at top of nag.
    'is_automatic' => false,                   // Automatically activate plugins after installation or not.
    'message'      => '',                      // Message to output right before the plugins table.
  );

  tgmpa( $plugins, $config );
}