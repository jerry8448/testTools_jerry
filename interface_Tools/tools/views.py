from django.shortcuts import render,HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Interface,UserInfo
import tushare as ts,json,pandas as pd,akshare as ak,os

# Create your views here.

file_path = 'static/demo_file/'

def get(request):
    return HttpResponse('这里是get请求')

@csrf_exempt
def post(request):
    if request.method == 'POST':
        print(request.POST)
        name = request.POST.get('name')
        return HttpResponse(name+"这里是post请求")
    else:
        return  HttpResponse('请使用post方法调用')

def index(request):
    return render(request,'web.html')

def test(request):
    return render(request,'test.html')

def stock_msg(request):
    pro = ts.pro_api()
    print(request.GET)
    ts_code = request.GET.get('ts_code')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    print(ts_code,start_date,end_date)
    if ts_code and start_date and end_date:
        if '-' in start_date:
            start_date = start_date.replace('-','')
            end_date = end_date.replace('-','')
        elif '/' in start_date:
            start_date = start_date.replace('/', '')
            end_date = end_date.replace('/', '')
        data = df = pro.daily(ts_code=request.GET.get('ts_code'), start_date=start_date, end_date=end_date)
        return HttpResponse(data.to_json(orient='records',force_ascii=False))
    else:
        return HttpResponse('请检查参数是否正确！')

def ak_stock_msg(request):
    import akshare as ak
    stock_zh_a_daily_qfq_df = ak.stock_zh_a_daily(symbol="sz000002", start_date="20221001", end_date="20221111",
                                                  adjust="qfq")
    return HttpResponse(stock_zh_a_daily_qfq_df.to_json(orient='records', force_ascii=False))

# def start_locust(request):
#     from locust import main
#     import sys,locust,os
#     script_file = os.path.dirname(__file__)
#     sys.path.append(script_file)
#
#     args = ['locust', '-f', 'E:\projects\stocks\qinqin.py','-t','60']
#     sys.argv = args
#     main.main()

# def create_locust_script():
#     with open(os.path.join(file_path,'qinqin.py'), 'w') as lfile:
#         lfile.write(imports)
#         lfile.write('\n\n')
#         lfile.write(tastset_get.format(url_path = '?tn=baidutop10'))
#         lfile.write('\n\n')
#         lfile.write(rqt_user.format(weight=1,url='http://www.baidu.com/'))

# def down_file(request):
#     create_locust_script()
#     file = open(os.path.join(file_path,'qinqin.py'), 'rb')
#     response = HttpResponse(file)
#     response['Content-Type'] = 'application/octet-stream'  # 设置头信息，告诉浏览器这是个文件
#     response['Content-Disposition'] = 'attachment;filename="qinqin.py"'
#     return response
@csrf_exempt
def save(request):
    if request.method == 'POST':
        method = request.POST.get('_method')
        headers ='NULL' if request.POST.get('_headers') == None else request.POST.get('_headers')
        datas = 'NULL' if request.POST.get('_datas') == None else request.POST.get('_datas')
        url = request.POST.get('_url')
        description = 'NULL' if request.POST.get('_description') == None else request.POST.get('_description')
        print(method,headers,datas,url,description)
        try:
            query_data = Interface.objects.get(url=url,method=method)
            query_data.headers = headers
            query_data.bodys = datas
            query_data.description = description
            query_data.save()
        except Interface.DoesNotExist:
            Interface.objects.create(method=method, url=url, headers=headers, bodys=datas,description=description)
        # if Interface.objects.get(url=url) is not None:
        #     pass
        # Interface.objects.create(method=method,url=url,headers=headers,bodys=datas)
        return HttpResponse('ok!')
    else:
        return  HttpResponse('请使用post方法调用')

def search(request):

    method = request.GET.get('method')
    url = request.GET.get('url')
    print(method,url)
    try:
        query_data = Interface.objects.get(url=url, method=method)
        response_data = {
            'method':query_data.method,
            'url':query_data.url,
            'headers':query_data.headers if query_data.headers != 'NULL' else json.dumps({}),
            'bodys':query_data.bodys if query_data.bodys != 'NULL' else json.dumps({}),
            'description':query_data.description if query_data.description != 'NULL' else json.dumps({}),
        }
        print(response_data)
        return HttpResponse(json.dumps(response_data))
    except Interface.DoesNotExist:
        return  HttpResponse(json.dumps({
            'status':-1,
            'message':'没有查询到保存的该接口信息！'
        }))

@csrf_exempt
def send(request):
    import requests
    print(request.POST)
    method = request.POST.get('method')
    headers = '{}' if request.POST.get('headers') == None else request.POST.get('headers')
    datas = '{}' if request.POST.get('bodys') == None else request.POST.get('bodys')
    url = request.POST.get('url')
    headers=json.loads(headers)
    headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' \
                            '(KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    datas = json.loads(datas)
    if method == 'GET':
        response = requests.get(url=url,params=datas,headers=headers)
        print(response.text)
        return HttpResponse(json.dumps(response.text))
    elif method == 'POST':
        print(type(datas))
        response = requests.post(url=url, data=datas, headers=headers)
        print(response.text)
        return HttpResponse(json.dumps(response.text))

def historys(request):
    try:
        query_data = Interface.objects.order_by('-id')[0:10]
        history_datas = []
        for i in query_data:
           history_datas.append([i.method,i.url,i.description])
        print(history_datas)
        return HttpResponse(json.dumps(history_datas))
    except Interface.DoesNotExist:
        return  HttpResponse(json.dumps({}))