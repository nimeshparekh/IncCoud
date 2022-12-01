import argparse
import json
import os
import sys

from frappeclient import FrappeClient

#conn = FrappeClient("https://erp.garudaadv.com", "info@cloudX.in", "Garuda@dv1234")

#lead = {"doctype": "Lead", "lead_name": "Jasvant","email_id":"jasvant.garuda@gmail.com","mobile_no":"9033524218"}

#print(conn.insert(lead))

def main(name, email, mobile):
    result_dics = {'msg': [], 'error': []}
    try:
        conn = FrappeClient("https://erp.garudaadv.com", "info@cloudX.in", "Garuda@dv1234")        
        lead = {"doctype": "Lead", "lead_name": name,"email_id":email,"mobile_no":mobile}
        conn.insert(lead)
        result_dics['msg'].append('Lead pushed')
    except Exception as e:
        result_dics['error'].append(e.failure.errors[0].message)
    return result_dics


if __name__ == '__main__':
    try:
        parser = argparse.ArgumentParser(
            description='Add a lead detail.')
        parser.add_argument('-n', '--name', type=str,
                            required=True, help='Lead name')
        parser.add_argument('-e', '--email', type=str,
                            required=True, help='Lead email')
        parser.add_argument('-m', '--mobile', type=str, required=True,
                            default='garuda',
                            help=('Lead detail for push to erp'))
        args = parser.parse_args()
        result = main(args.name, args.email, args.mobile)
        print(json.dumps(result))
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({'msg':[],'error': [str(e)]}))
        sys.stdout.flush()
