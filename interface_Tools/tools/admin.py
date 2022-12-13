from django.contrib import admin #Django自动在admin.py文件中导入
from .models import Interface, UserInfo #这个需要我们自己导入相应的模型类（数据表）

admin.site.register({Interface,UserInfo})

# Register your models here.
