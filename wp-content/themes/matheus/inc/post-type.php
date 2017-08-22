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

/* Adding post format support to custom-post-type */
add_theme_support('post-formats', array('video','gallery'));
add_post_type_support( 'portfolio', 'post-formats' );