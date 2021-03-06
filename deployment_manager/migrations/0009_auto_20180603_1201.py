# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-06-03 12:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('deployment_manager', '0008_remove_repository_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='deploymenttarget',
            name='status',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AlterField(
            model_name='runningdeployment',
            name='deployment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='running_deployments', related_query_name='running_deployment', to='deployment_manager.Deployment'),
        ),
    ]
