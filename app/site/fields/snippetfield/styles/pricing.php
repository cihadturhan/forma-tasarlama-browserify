<table class="structure-table">
  <thead>
    <tr>
      <?php foreach($field->fields() as $f): ?>
      <th>
        <?php echo html($field->i18n($f['label']), false) ?>
      </th>
      <?php endforeach ?>
      <th class="structure-table-options">  
        &nbsp;
      </th>
    </tr>    
  </thead>
  <tbody>
    <?php foreach($field->entries() as $entry): ?>
    <tr id="structure-entry-<?php echo $entry->id() ?>">
      <?php foreach($field->fields() as $f): ?>
      <td>
        <a data-modal href="<?php __($field->url($entry->id() . '/update')) ?>">
          <?php if(isset($entry->{$f['name']})): ?>
            <?php
            if( ! empty( $f['snippet']) ) {
                echo tpl::load(c::get( 'snippetfield.path', kirby()->roots()->snippets() ) . DS . $f['snippet'] . '.php', array(
                  'page' => $page,
                  'field' => $field,
                  'entry' => $entry,
                  'value' => $entry->{$f['name']},
                  'style' => $style
                ), true);
            } else {
              echo html(@$entry->{$f['name']}, false);
            }
            ?>
          <?php else: ?>
          &nbsp;
          <?php endif ?>
        </a>
      </td>
      <?php endforeach ?>
      <td class="structure-table-options">
        <a data-modal class="btn" href="<?php __($field->url($entry->id() . '/delete')) ?>">
          <?php i('trash-o') ?>
        </a>
      </td>
    </tr>
    <?php endforeach ?>

    <tr id="structure-entry-total">
        <td colspan="<? echo (count($field->fields())- 2)?>"></td>
        <td> <a href="#">Toplam</a></td>
        <td>
            <a href="#">
        <?php
            echo tpl::load(c::get( 'snippetfield.path', kirby()->roots()->snippets() ) . DS . 'table/total.php', array(
              'entries' => $field->entries()
            ), true);
        ?>
        </a>
        </td>
        <td> <a href="#">&nbsp;</a></td>
    <tr/>
  </tbody>
</table>