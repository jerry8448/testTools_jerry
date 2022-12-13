from django.db import models

# Create your models here.

class Interface(models.Model):

    method = models.CharField( max_length=15,verbose_name='method')
    url = models.CharField( max_length=100,verbose_name='url')
    headers = models.CharField(max_length=100,verbose_name='headers')
    bodys = models.CharField(max_length=100,verbose_name='bodys')
    cookies = models.CharField(max_length=100, verbose_name='cookies')
    description = models.CharField(max_length=100, verbose_name='description')


# class Author(models.Model): #创建作者表
#     name=models.CharField(max_length=30,verbose_name='姓名')
#     email=models.EmailField(verbose_name='邮箱')
#
#     def __str__(self):
#         return '作者：%s'%(self.name)


class UserInfo(models.Model): #创建用户信息表
    username=models.CharField(max_length=24,verbose_name='用户注册')
    password =models.CharField(max_length=24,verbose_name='密码')


