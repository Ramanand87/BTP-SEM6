# Generated by Django 5.1.5 on 2025-04-06 17:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contract', '0003_rename_approved_contract_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contractdoc',
            name='contract',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pdf_doc', to='contract.contract'),
        ),
        migrations.AlterField(
            model_name='contractdoc',
            name='document',
            field=models.FileField(upload_to='contracts_pdfs/'),
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receipt', models.FileField(upload_to='receipts')),
                ('description', models.TextField(blank=True)),
                ('date', models.DateField()),
                ('amount', models.IntegerField(default=0)),
                ('reference_number', models.CharField(max_length=255)),
                ('contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contract.contract')),
            ],
        ),
    ]
