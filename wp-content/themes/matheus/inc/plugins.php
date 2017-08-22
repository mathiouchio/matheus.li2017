<?php
add_action( 'tgmpa_register', 'matheusli_register_required_plugins' );
function matheusli_register_required_plugins() {
  $plugins = array(
    array(
      'name'      => 'WP REST API',
      'slug'      => 'rest-api',
      'required'  => true,
    ),
    array(
      'name'      => 'Advanced Custom Fields',
      'slug'      => 'advanced-custom-fields',
      'required'  => true,
    ),
    array(
      'name'      => 'Advanced Custom Fields: Repeater Field',
      'slug'      => 'acf-repeater',
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