# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-09 10:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20171207_1527'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='guest',
            name='guest_user',
        ),
        migrations.RemoveField(
            model_name='guest',
            name='hotel',
        ),
        migrations.RemoveField(
            model_name='guest',
            name='room',
        ),
        migrations.RemoveField(
            model_name='hotel',
            name='hotel_user',
        ),
        migrations.RemoveField(
            model_name='hub',
            name='hub_user',
        ),
        migrations.AddField(
            model_name='hoteluser',
            name='hotel',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='users', to='api.Hotel'),
        ),
        migrations.AddField(
            model_name='hubuser',
            name='hub',
            field=models.OneToOneField(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hub_user', to='api.Hub'),
        ),
        migrations.DeleteModel(
            name='Guest',
        ),
    ]
