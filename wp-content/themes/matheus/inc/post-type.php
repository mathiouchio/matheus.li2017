<?php
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
        'thumbnail',
        'post-formats'
      ),
      'rewrite' => array(
        'with_front' => false
      )
    )
  );

  register_post_type( 'old',
    array(
      'labels' => array(
        'name' => __( 'Old Portfolio' ),
        'singular_name' => __( 'Old Porfolio' )
      ),
      'public' => true,
      'publicly_queryable' => false,
      'show_in_rest' => true,
      'rest_base' => 'old_portfolio',
      'has_archive' => false,
      'supports' => array(
        'title',
        'editor',
        'thumbnail'
      ),
      'rewrite' => array(
        'with_front' => false
      )
    )
  );

  add_post_type_support( 'portfolio', 'post-formats' );
  add_post_type_support( 'old', 'post-formats' );
}

/* Adding post format support to custom-post-type */
add_theme_support('post-formats', array('video','gallery'));
