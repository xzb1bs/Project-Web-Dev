# Generated by Django 5.2 on 2025-04-23 18:37

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_remove_task_description_remove_task_due_date_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='column',
            options={},
        ),
        migrations.RemoveField(
            model_name='column',
            name='order',
        ),
        migrations.RemoveField(
            model_name='task',
            name='created_at',
        ),
        migrations.AlterField(
            model_name='column',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='task',
            name='column',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='api.column'),
        ),
        migrations.AlterField(
            model_name='task',
            name='title',
            field=models.CharField(max_length=255),
        ),
    ]
