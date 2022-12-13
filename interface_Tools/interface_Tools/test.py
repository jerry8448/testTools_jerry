from types import ModuleType
import sys,os
from locust import main

auto_module = ModuleType('auto_module','this is a auto create module')
code = """
age = 16

def foo():
    return "^_^"
"""

exec(code, auto_module.__dict__)
print(auto_module.age)
print(auto_module.foo())
sys.modules['autos'] = auto_module
autos= __import__('autos')
templates_py = 'E:\\load_py'
pathname = 'E:\\load_py\\test.py'
print(os.path.realpath(__file__))