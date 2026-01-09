import requests
import sys
import json
from datetime import datetime

class SentinelAPITester:
    def __init__(self, base_url="https://fraudsentry-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ {name} - PASSED")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ {name} - FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ {name} - ERROR: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_login(self):
        """Test official login"""
        success, response = self.run_test(
            "Official Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": "official@sentinel.gov.in", "password": "demo123"}
        )
        if success and isinstance(response, dict) and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_citizen_projects(self):
        """Test citizen projects endpoint"""
        success, response = self.run_test(
            "Citizen Projects List",
            "GET",
            "api/citizen/projects",
            200
        )
        if success and isinstance(response, dict):
            projects = response.get('projects', [])
            print(f"   Found {len(projects)} projects")
            return len(projects) > 0, projects
        return False, []

    def test_citizen_project_detail(self, project_id):
        """Test citizen project detail"""
        success, response = self.run_test(
            "Citizen Project Detail",
            "GET",
            f"api/citizen/projects/{project_id}",
            200
        )
        return success, response

    def test_citizen_report_submission(self, project_id):
        """Test citizen report submission"""
        success, response = self.run_test(
            "Citizen Report Submission",
            "POST",
            "api/citizen/reports",
            200,
            data={
                "project_id": project_id,
                "description": "Test fraud report - suspicious activity detected",
                "location": None,
                "is_anonymous": True
            }
        )
        return success, response

    def test_official_dashboard(self):
        """Test official dashboard"""
        success, response = self.run_test(
            "Official Dashboard",
            "GET",
            "api/official/dashboard",
            200
        )
        if success and isinstance(response, dict):
            print(f"   Total contracts: {response.get('total_contracts', 'N/A')}")
            print(f"   High risk contracts: {response.get('high_risk_contracts', 'N/A')}")
            print(f"   Citizen reports: {response.get('total_citizen_reports', 'N/A')}")
        return success, response

    def test_official_contracts(self):
        """Test official contracts list"""
        success, response = self.run_test(
            "Official Contracts List",
            "GET",
            "api/official/contracts",
            200
        )
        if success and isinstance(response, dict):
            contracts = response.get('contracts', [])
            print(f"   Found {len(contracts)} contracts")
            return len(contracts) > 0, contracts
        return False, []

    def test_official_contract_detail(self, contract_id):
        """Test official contract detail"""
        success, response = self.run_test(
            "Official Contract Detail",
            "GET",
            f"api/official/contracts/{contract_id}",
            200
        )
        if success and isinstance(response, dict):
            print(f"   Fraud risk score: {response.get('fraud_risk_score', 'N/A')}")
            print(f"   Vendor details: {'Yes' if response.get('vendor_details') else 'No'}")
        return success, response

    def test_audit_action(self, contract_id):
        """Test audit action submission"""
        success, response = self.run_test(
            "Audit Action Submission",
            "POST",
            f"api/official/contracts/{contract_id}/audit-action",
            200,
            data={
                "action": "send_for_audit",
                "notes": "Test audit action - flagged for detailed review"
            }
        )
        return success, response

    def test_official_vendors(self):
        """Test official vendors list"""
        success, response = self.run_test(
            "Official Vendors List",
            "GET",
            "api/official/vendors",
            200
        )
        if success and isinstance(response, dict):
            vendors = response.get('vendors', [])
            print(f"   Found {len(vendors)} vendors")
            return len(vendors) > 0, vendors
        return False, []

    def test_official_vendor_detail(self, vendor_id):
        """Test official vendor detail"""
        success, response = self.run_test(
            "Official Vendor Detail",
            "GET",
            f"api/official/vendors/{vendor_id}",
            200
        )
        return success, response

def main():
    print("🚀 Starting Sentinel API Testing...")
    print("=" * 50)
    
    tester = SentinelAPITester()
    
    # Test 1: Official Login
    if not tester.test_login():
        print("\n❌ Login failed - cannot proceed with authenticated tests")
        print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
        return 1

    # Test 2: Citizen Projects (no auth required)
    projects_success, projects = tester.test_citizen_projects()
    
    # Test 3: Citizen Project Detail (if projects exist)
    if projects_success and projects:
        project_id = projects[0].get('id')
        if project_id:
            tester.test_citizen_project_detail(project_id)
            # Test citizen report submission
            tester.test_citizen_report_submission(project_id)

    # Test 4: Official Dashboard (requires auth)
    tester.test_official_dashboard()

    # Test 5: Official Contracts (requires auth)
    contracts_success, contracts = tester.test_official_contracts()
    
    # Test 6: Official Contract Detail (if contracts exist)
    if contracts_success and contracts:
        contract_id = contracts[0].get('id')
        if contract_id:
            tester.test_official_contract_detail(contract_id)
            # Test audit action
            tester.test_audit_action(contract_id)

    # Test 7: Official Vendors (requires auth)
    vendors_success, vendors = tester.test_official_vendors()
    
    # Test 8: Official Vendor Detail (if vendors exist)
    if vendors_success and vendors:
        vendor_id = vendors[0].get('id')
        if vendor_id:
            tester.test_official_vendor_detail(vendor_id)

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failed_test in tester.failed_tests:
            print(f"   - {failed_test}")
    else:
        print("\n✅ All tests passed!")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())