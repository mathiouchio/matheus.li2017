<?php
/**
 * Enqueue functions.
 */
require get_template_directory() . '/inc/enqueue.php';

/**
 * Custom post type functions.
 */
require get_template_directory() . '/inc/post-type.php';

/**
 * Custom REST API functions.
 */
require get_template_directory() . '/inc/rest.php';

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

/**
 * Plugins functions.
 */
require get_template_directory() . '/inc/plugins.php';

/**
 * Custom fields functions.
 */
require get_template_directory() . '/inc/fields.php';

/**
 * Featured image
 */ 
add_theme_support( 'post-thumbnails' );

/**
 * Redirect 404 to homepage:
 * https://wordpress.stackexchange.com/questions/44983/disable-single-post-page/44990
 */ 
add_action( 'pre_get_posts', 'wpse44983_single_post_404' );
function wpse44983_single_post_404( $query ) {
  if ( $query->is_main_query() && $query->is_single() ) {
    $query->is_404 = true;
  }
}
