import argparse
import json
import os
import sys

from frappeclient import FrappeClient

def main(name, email, mobile , owner_email, password):
    result_dics = {'msg': [], 'error': []}
    try:
        conn = FrappeClient("https://erp.cloudX.in", owner_email, password)
        customer = {"doctype": "Customer", "customer_name": name,"email_id":email,"mobile_no":mobile}
        conn.insert(customer)
        result_dics['msg'].append('customer pushed')
    except Exception as e:
        result_dics['error'].append(e.failure.errors[0].ss)
    return result_dics


if __name__ == '__main__':
    try:
        parser = argparse.ArgumentParser(
            description='Add a Customer detail.')
        parser.add_argument('-n', '--name', type=str,
                            required=True, help='Customer name')
        parser.add_argument('-e', '--email', type=str,
                            required=True, help='Customer email')
        parser.add_argument('-m', '--mobile', type=str, required=True,
                            default='garuda',
                            help=('Customer detail for push to erp'))
        parser.add_argument('-u', '--owner_email', type=str,
                            required=True, help='user signin email')
        parser.add_argument('-p', '--password', type=str,
                            required=True, help='user signin password')
        args = parser.parse_args()
        result = main(args.name, args.email, args.mobile, args.owner_email, args.password)
        print(json.dumps(result))
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({'msg':[],'error': [str(e)]}))
        sys.stdout.flush()
