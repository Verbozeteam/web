# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-07-01 09:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20180603_1201'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='floor',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='room',
            name='name',
            field=models.CharField(default='', max_length=128),
        ),
    ]
