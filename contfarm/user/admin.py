from django.contrib import admin
from . import models

admin.site.register(models.ContractorProfile)
admin.site.register(models.FarmerProfile)
admin.site.register(models.Documents)