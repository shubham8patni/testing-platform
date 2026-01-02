# User Guide

## 🎯 Welcome to the Insurance Testing Platform

This guide will help you understand how to use the Insurance Testing Platform to validate insurance policy purchase flows across different environments and detect regressions before production deployment.

## 🚀 Getting Started

### What is the Insurance Testing Platform?

The Insurance Testing Platform is a tool that automatically tests insurance policy purchase flows by:
- **Executing identical test scenarios** in multiple environments (DEV/QA vs STAGE)
- **Comparing results** between environments to detect differences
- **Using AI analysis** to explain the business impact of differences
- **Providing detailed reports** for regression detection

### Who Should Use This Platform?

- **QA Engineers**: Automated regression testing
- **Development Teams**: Pre-deployment validation
- **Product Managers**: Business impact analysis
- **Operations Teams**: Environment health monitoring

## 🌐 Accessing the Platform

### Web Interface
1. Open your web browser
2. Navigate to: `https://your-platform-domain.com`
3. Create a user account or log in

### API Access
- **Base URL**: `https://your-platform-domain.com/api/v1`
- **Documentation**: `https://your-platform-domain.com/docs`
- **Authentication**: JWT token-based

## 📋 Quick Start Guide

### Step 1: Create Your User Account

1. **Navigate to Welcome Page**
   - Enter your name (e.g., "John Doe")
   - Click "Create User"

2. **User Dashboard**
   - Your user ID will be generated (e.g., "john_doe")
   - View your test history and previous results

### Step 2: Configure a Test

1. **Go to Test Configuration**
   - Click "New Test" from the dashboard
   - Fill in the test configuration form

2. **Select Environments**
   - **Target Environment**: Choose DEV or QA (the environment you want to test)
   - **Baseline Environment**: Choose STAGE (the stable environment for comparison)

3. **Choose Test Scope**
   
   **All Categories**: Test every available product and plan
   - Best for comprehensive regression testing
   - Takes longer to complete (30-60 minutes)
   
   **Specific Category**: Test all plans in one category
   - Examples: "car", "travel", "health"
   - Good for focused testing (5-15 minutes)
   
   **Specific Product**: Test all plans for one product
   - Examples: "zurich_autocillin_mv4", "international_travel"
   - Good for product-specific validation (2-5 minutes)
   
   **Specific Plan**: Test a single plan
   - Example: "car:zurich_autocillin_mv4:tlo"
   - Best for quick validation (1-2 minutes)

4. **Configure Authentication**
   - **Admin Token**: Your admin portal access token
   - **Customer Token**: Your customer portal access token
   - Tokens are stored securely and used for API calls

5. **Add AI Prompt (Optional)**
   - Provide specific instructions for AI analysis
   - Examples:
     - "Focus on pricing differences and tax calculations"
     - "Check if COVID coverage is correctly applied"
     - "Look for any changes in policy issuance flow"

### Step 3: Run the Test

1. **Start Test Execution**
   - Click "Start Test" button
   - You'll be redirected to the progress page

2. **Monitor Progress**
   - Real-time progress updates
   - Individual plan status
   - Current step being executed
   - Estimated time remaining

3. **Test Status Indicators**
   - 🟡 **Running**: Test currently executing
   - ✅ **Completed**: Test finished successfully
   - ❌ **Failed**: Test encountered an error
   - ⏸️ **Paused**: Test temporarily paused

### Step 4: Review Results

1. **Test Summary**
   - Total plans tested
   - Completed vs failed plans
   - Overall execution time
   - AI analysis summary

2. **Environment Comparison**
   - **Match**: No significant differences found
   - **Diff**: Differences detected with AI analysis
   - **Error**: Test failed in one or both environments

3. **Plan-Level Details**
   - Click any plan to see detailed information
   - API call sequence and responses
   - Specific differences between environments
   - AI-powered analysis and recommendations

## 🔍 Understanding Test Results

### Result Types

#### ✅ Match (No Issues)
- Both environments produced identical results
- No regressions detected
- Plan is working correctly

#### ⚠️ Differences (Attention Required)
- Environments produced different results
- AI analysis explains the differences
- May indicate a regression or expected change

#### ❌ Errors (Critical Issues)
- Test failed to complete in one or both environments
- Could indicate API failures, network issues, or system problems
- Requires immediate investigation

### AI Analysis Features

#### Severity Classification
- **🔴 Critical**: Business-impacting differences (pricing, policy status)
- **🟡 Warning**: Important differences (coverage amounts, timestamps)
- **🔵 Info**: Minor differences (IDs, generated fields)

#### Business Impact Assessment
- **Pricing Differences**: Premium, tax, or total amount changes
- **Coverage Changes**: Sum insured, deductibles, or policy terms
- **Process Changes**: Application flow, verification steps
- **Data Changes**: Customer information, policy details

#### Recommendations
- **Fix Required**: Address critical issues before production
- **Monitor**: Keep an eye on warning-level differences
- **Accept**: Documented changes or non-critical differences

## 📊 Test Scenarios and Use Cases

### Pre-Deployment Validation
**When**: Before deploying new code to production
**Purpose**: Catch regressions before they affect customers
**Configuration**:
- Target: QA environment with new code
- Baseline: Production environment
- Scope: All categories (comprehensive testing)

### Environment Consistency Check
**When**: After environment updates or maintenance
**Purpose**: Ensure environments remain synchronized
**Configuration**:
- Target: DEV environment
- Baseline: QA environment
- Scope: Specific category (focused testing)

### Product Launch Validation
**When**: Launching new insurance products or plans
**Purpose**: Verify new products work correctly
**Configuration**:
- Target: QA with new products
- Baseline: QA without new products
- Scope: Specific product (new product testing)

### Regulatory Compliance Check
**When**: After regulatory changes
**Purpose**: Ensure compliance with new regulations
**Configuration**:
- Target: Environment with compliance changes
- Baseline: Environment before changes
- AI Prompt: "Focus on regulatory compliance differences"

## 🔧 Advanced Features

### Custom AI Prompts

#### Pricing Focus
```
Analyze pricing differences including:
- Base premium calculations
- Tax computation accuracy
- Discount applications
- Total amount consistency
```

#### Coverage Analysis
```
Examine coverage differences:
- Sum insured amounts
- Deductible calculations
- Coverage limits
- Add-on inclusions
```

#### Process Flow
```
Review application process:
- Step sequence completeness
- Required field validations
- Error handling
- Success/failure conditions
```

### Test History and Trending

#### Viewing Historical Results
1. Go to User Dashboard
2. Click "Test History"
3. Filter by date, status, or scope
4. Compare results over time

#### Identifying Patterns
- **Recurring Differences**: May indicate systematic issues
- **Improving Trends**: Quality improvements over time
- **Degradation Patterns**: Need immediate attention

### Export and Sharing

#### Export Options
- **PDF Report**: Complete test summary and analysis
- **CSV Data**: Raw data for further analysis
- **JSON Export**: Machine-readable test results
- **Share Link**: Temporary link for team access

#### Report Contents
- Executive summary
- Detailed test results
- AI analysis and recommendations
- Technical details and API responses

## 🚨 Common Issues and Solutions

### Test Failures

#### Authentication Errors
**Problem**: "401 Unauthorized" errors
**Solution**:
1. Check token validity and expiration
2. Verify correct token type (admin vs customer)
3. Ensure tokens have required permissions
4. Contact platform administrator if needed

#### Timeouts
**Problem**: Tests taking too long or timing out
**Solution**:
1. Check external API status
2. Verify network connectivity
3. Reduce test scope if needed
4. Contact support for timeout adjustments

#### Incomplete Tests
**Problem**: Some plans fail while others succeed
**Solution**:
1. Check specific product availability
2. Verify configuration for failing plans
3. Review error messages in plan details
4. Try running failing plans individually

### Result Interpretation

#### Understanding Expected Differences
- **Timestamps**: May differ by seconds/minutes (acceptable)
- **Generated IDs**: Policy numbers and transaction IDs (expected)
- **Environment URLs**: Different base URLs (normal)

#### Investigating Unexpected Differences
1. **Review AI Analysis**: Check AI explanations
2. **Compare API Responses**: Look at raw API data
3. **Check Change Logs**: Recent updates to target environment
4. **Consult Development Team**: For technical assistance

## 📈 Best Practices

### Test Planning
- **Schedule Regular Tests**: Daily or weekly depending on release cycle
- **Test After Changes**: Run tests after code deployments
- **Use Consistent Scopes**: Make results comparable over time
- **Document Findings**: Track and share important discoveries

### Result Analysis
- **Review AI Recommendations**: Take suggested actions seriously
- **Investigate Trends**: Look for patterns in test results
- **Share Findings**: Communicate issues to relevant teams
- **Document Resolutions**: Record how issues were fixed

### Environment Management
- **Keep Environments Clean**: Remove test data regularly
- **Monitor Health**: Watch for environment degradation
- **Update Configuration**: Keep product mappings current
- **Backup Results**: Save important test results

## 🔒 Security and Privacy

### Token Management
- **Store Tokens Securely**: Never share tokens via email or chat
- **Rotate Regularly**: Update tokens periodically
- **Use Least Privilege**: Grant only necessary permissions
- **Monitor Usage**: Watch for unauthorized token usage

### Data Protection
- **Sensitive Data**: Platform handles personal and financial information
- **Data Encryption**: All data transmission is encrypted
- **Access Control**: Only authorized users can view results
- **Data Retention**: Old test results are automatically cleaned up

## 📞 Getting Help

### Support Resources
- **Documentation**: Complete guides and API reference
- **Help Center**: FAQs and troubleshooting articles
- **Community Forum**: User discussions and best practices
- **Support Team**: Direct assistance for critical issues

### Contact Information
- **Technical Support**: support@your-platform.com
- **Feature Requests**: features@your-platform.com
- **Security Issues**: security@your-platform.com
- **General Inquiries**: info@your-platform.com

### Training and Onboarding
- **Live Training Sessions**: Weekly demo sessions
- **Video Tutorials**: Step-by-step guides
- **Documentation Workshops**: How to use advanced features
- **Best Practice Webinars**: Industry-specific use cases

---

## 🎉 Conclusion

The Insurance Testing Platform is designed to make regression testing reliable, efficient, and insightful. By following this guide, you can:

- **Detect regressions** before they affect customers
- **Understand differences** with AI-powered analysis
- **Improve quality** through systematic testing
- **Save time** with automated workflows

Thank you for using the Insurance Testing Platform. Your feedback helps us improve the platform for everyone!

---

**Last Updated**: January 2026  
**Platform Version**: 1.0.0-alpha  
**For the latest information**, check the online help center or contact support.