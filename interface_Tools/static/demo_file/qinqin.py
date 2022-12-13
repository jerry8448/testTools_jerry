from locust import HttpUser,task,TaskSet,between,main

class autoTaskSet(TaskSet):
    def on_start(self):
        self.url_path = '?tn=baidutop10'

    @task(1)
    def get_ztnr(self):
        res = self.client.get(self.url_path)

class autoHttpLocust(HttpUser):

    tasks = [autoTaskSet,]
    wait_time = between(1,1)
    weight = int('1')
    host = 'http://www.baidu.com/' 