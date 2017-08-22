<?php
if(function_exists("register_field_group")) {
  register_field_group(array (
    'id' => 'acf_video-posts',
    'title' => 'Video Posts',
    'fields' => array (
      array (
        'key' => 'field_58ffad28d5f8a',
        'label' => 'Videos',
        'name' => 'videos',
        'type' => 'repeater',
        'sub_fields' => array (
          array (
            'key' => 'field_58ffbdcada41b',
            'label' => 'Youtube ID',
            'name' => 'youtube_id',
            'type' => 'text',
            'instructions' => 'Case Sensitive',
            'column_width' => '',
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'formatting' => 'none',
            'maxlength' => '',
          ),
          array (
            'key' => 'field_58ffbdf3da41c',
            'label' => 'Vimeo ID',
            'name' => 'vimeo_id',
            'type' => 'text',
            'column_width' => '',
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'formatting' => 'none',
            'maxlength' => '',
          ),
          array (
            'key' => 'field_58ffbdfdda41d',
            'label' => 'Video URL',
            'name' => 'video_url',
            'type' => 'text',
            'column_width' => '',
            'default_value' => '',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'formatting' => 'none',
            'maxlength' => '',
          ),
        ),
        'row_min' => '',
        'row_limit' => '',
        'layout' => 'row',
        'button_label' => 'Add Row',
      ),
    ),
    'location' => array (
      array (
        array (
          'param' => 'post_format',
          'operator' => '==',
          'value' => 'video',
          'order_no' => 0,
          'group_no' => 0,
        ),
      ),
    ),
    'options' => array (
      'position' => 'acf_after_title',
      'layout' => 'no_box',
      'hide_on_screen' => array (
      ),
    ),
    'menu_order' => 0,
  ));

  register_field_group(array (
    'id' => 'acf_old-portfolio',
    'title' => 'Old Portfolio',
    'fields' => array (
      array (
        'key' => 'field_599c871b421d1',
        'label' => 'Thumb',
        'name' => 'thumb',
        'type' => 'image',
        'save_format' => 'id',
        'preview_size' => 'thumbnail',
        'library' => 'uploadedTo',
      ),
      array (
        'key' => 'field_599c879f421d2',
        'label' => 'Thumb Hover',
        'name' => 'thumb_hover',
        'type' => 'image',
        'save_format' => 'id',
        'preview_size' => 'thumbnail',
        'library' => 'uploadedTo',
      ),
      array (
        'key' => 'field_599c87b1421d3',
        'label' => 'Background',
        'name' => 'background',
        'type' => 'image',
        'save_format' => 'id',
        'preview_size' => 'thumbnail',
        'library' => 'uploadedTo',
      ),
      array (
        'key' => 'field_599c889f9b0b4',
        'label' => 'Slides',
        'name' => 'slides',
        'type' => 'repeater',
        'sub_fields' => array (
          array (
            'key' => 'field_599c88af9b0b5',
            'label' => 'slide',
            'name' => 'slide',
            'type' => 'image',
            'column_width' => 50,
            'save_format' => 'id',
            'preview_size' => 'thumbnail',
            'library' => 'uploadedTo',
          ),
        ),
        'row_min' => '',
        'row_limit' => '',
        'layout' => 'table',
        'button_label' => 'Add Slide',
      ),
    ),
    'location' => array (
      array (
        array (
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'old',
          'order_no' => 0,
          'group_no' => 0,
        ),
      ),
    ),
    'options' => array (
      'position' => 'acf_after_title',
      'layout' => 'default',
      'hide_on_screen' => array (
      ),
    ),
    'menu_order' => 0,
  ));

}

