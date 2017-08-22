<?php
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
