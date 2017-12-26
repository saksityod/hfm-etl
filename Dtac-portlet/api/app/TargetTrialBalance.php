<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TargetTrialBalance extends Model
{
    protected $table = 'target_trial_balance';

    protected $primaryKey = 'target_tb_id';
    public $incrementing = true;
}
