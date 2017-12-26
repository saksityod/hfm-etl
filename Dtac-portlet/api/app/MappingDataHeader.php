<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MappingDataHeader extends Model
{
    protected $table = 'mapping_data_header';

    protected $primaryKey = 'mapping_data_id';
    public $incrementing = true;
}
