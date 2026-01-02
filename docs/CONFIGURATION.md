# Configuration Guide

This guide explains how to configure the Insurance Testing Platform for your insurance products and environments.

## 🎯 Configuration Overview

The platform uses JSON configuration files located in the `data/configs/` directory:

- `environments.json` - Environment configurations
- `products.json` - Insurance product mappings

## 🌐 Environment Configuration

### File Location
`data/configs/environments.json`

### Structure
```json
{
  "environments": {
    "environment_key": {
      "name": "Display Name",
      "base_url": "https://api-yourcompany.com",
      "auth": {
        "type": "bearer|basic|custom",
        "token_field": "token_field_name",
        "custom_headers": {...}
      }
    }
  }
}
```

### Example Configuration
```json
{
  "environments": {
    "dev": {
      "name": "Development Environment",
      "base_url": "https://api-dev.insuranceco.com",
      "auth": {
        "type": "bearer",
        "token_field": "dev_token"
      }
    },
    "qa": {
      "name": "Quality Assurance Environment",
      "base_url": "https://api-qa.insuranceco.com", 
      "auth": {
        "type": "bearer",
        "token_field": "qa_token"
      }
    },
    "stage": {
      "name": "Staging Environment",
      "base_url": "https://api-stage.insuranceco.com",
      "auth": {
        "type": "bearer",
        "token_field": "stage_token"
      }
    }
  }
}
```

### Authentication Types

#### Bearer Token (Recommended)
```json
{
  "type": "bearer",
  "token_field": "your_api_token"
}
```

#### Basic Authentication
```json
{
  "type": "basic",
  "username_field": "your_username",
  "password_field": "your_password"
}
```

#### Custom Authentication
```json
{
  "type": "custom",
  "custom_headers": {
    "Authorization": "Bearer your_custom_token",
    "X-API-Key": "your_api_key",
    "X-Client-ID": "your_client_id"
  }
}
```

## 🏷️ Product Configuration

### File Location
`data/configs/products.json`

### Structure
```json
{
  "categories": {
    "category_key": {
      "name": "Display Name",
      "display_order": 1,
      "products": {
        "product_key": {
          "id": "system_product_id",
          "name": "Product Display Name",
          "description": "Product description",
          "plans": {
            "plan_key": {
              "id": "system_plan_id",
              "name": "Plan Display Name",
              "description": "Plan description",
              "test_sequence": ["application", "payment", "policy"],
              "requirements": {
                "min_age": 18,
                "max_age": 70,
                "required_documents": ["id", "insurance_history"]
              }
            }
          }
        }
      }
    }
  }
}
```

### Complete Example
```json
{
  "categories": {
    "car": {
      "name": "Car Insurance",
      "display_order": 1,
      "products": {
        "comprehensive": {
          "id": "car_comp_prod_001",
          "name": "Comprehensive Car Insurance",
          "description": "Full coverage car insurance policy",
          "plans": {
            "basic": {
              "id": "car_basic_plan_001",
              "name": "Basic Coverage",
              "description": "Essential coverage with liability",
              "test_sequence": ["application", "payment", "policy"]
            },
            "premium": {
              "id": "car_prem_plan_001", 
              "name": "Premium Coverage",
              "description": "Enhanced coverage with comprehensive benefits",
              "test_sequence": ["application", "payment", "policy", "verification"]
            }
          }
        },
        "liability": {
          "id": "car_liab_prod_001",
          "name": "Liability Only Insurance",
          "description": "Third-party liability coverage",
          "plans": {
            "standard": {
              "id": "car_liab_std_001",
              "name": "Standard Liability",
              "description": "Basic third-party liability coverage",
              "test_sequence": ["application", "payment", "policy"]
            }
          }
        }
      }
    },
    "motorcycle": {
      "name": "Motorcycle Insurance",
      "display_order": 2,
      "products": {
        "comprehensive": {
          "id": "motor_comp_prod_001",
          "name": "Comprehensive Motorcycle Insurance",
          "description": "Full coverage motorcycle policy",
          "plans": {
            "basic": {
              "id": "motor_basic_plan_001",
              "name": "Basic Coverage",
              "description": "Essential motorcycle coverage",
              "test_sequence": ["application", "payment", "policy"]
            },
            "sport": {
              "id": "motor_sport_plan_001",
              "name": "Sport Coverage",
              "description": "Enhanced coverage for sport motorcycles",
              "test_sequence": ["application", "payment", "policy", "verification"]
            }
          }
        }
      }
    },
    "travel": {
      "name": "Travel Insurance", 
      "display_order": 3,
      "products": {
        "international": {
          "id": "travel_int_prod_001",
          "name": "International Travel Insurance",
          "description": "Coverage for international travel",
          "plans": {
            "single_trip": {
              "id": "travel_single_trip_001",
              "name": "Single Trip Coverage",
              "description": "Coverage for single international trip",
              "test_sequence": ["application", "payment", "policy"]
            },
            "annual": {
              "id": "travel_annual_001",
              "name": "Annual Coverage", 
              "description": "Annual multi-trip coverage",
              "test_sequence": ["application", "payment", "policy", "verification"]
            }
          }
        }
      }
    },
    "health": {
      "name": "Health Insurance",
      "display_order": 4,
      "products": {
        "family": {
          "id": "health_fam_prod_001",
          "name": "Family Health Insurance",
          "description": "Family health coverage plan",
          "plans": {
            "basic": {
              "id": "health_basic_001",
              "name": "Basic Family Plan",
              "description": "Essential family health coverage",
              "test_sequence": ["application", "payment", "policy"]
            },
            "premium": {
              "id": "health_prem_001",
              "name": "Premium Family Plan",
              "description": "Enhanced family health coverage",
              "test_sequence": ["application", "payment", "policy", "verification"]
            }
          }
        }
      }
    }
  }
}
```

## 🔧 Configuration Management

### Adding New Environments

1. Edit `data/configs/environments.json`
2. Add new environment entry
3. Restart the platform or reload configuration

### Adding New Products

1. Edit `data/configs/products.json`
2. Add new category or product entry
3. Include all required fields (id, name, plans, etc.)
4. Restart the platform to load new configuration

### Configuration Reload

The platform supports hot reloading of configuration files:

- **API Method**: `POST /api/v1/config/reload`
- **Auto-detection**: Platform monitors for configuration changes
- **No Downtime**: New configurations load without restart

## 🎯 Best Practices

### Naming Conventions

- **Environment Keys**: Use lowercase (dev, qa, stage, prod)
- **Product Keys**: Use descriptive, lowercase with underscores
- **Plan Keys**: Use descriptive names (basic, premium, comprehensive)

### ID Management

- **System IDs**: Actual IDs from your insurance system
- **Display Names**: User-friendly names for UI display
- **Consistency**: Keep system IDs consistent across environments

### Test Sequences

Define the actual API call sequence for each plan:

```json
{
  "test_sequence": [
    "application",
    "payment", 
    "policy",
    "verification"
  ]
}
```

Common sequences:
- **Basic**: `["application", "payment", "policy"]`
- **Enhanced**: `["application", "payment", "policy", "verification"]`
- **Premium**: `["application", "payment", "policy", "verification", "customer_portal"]`

## 🔄 Platform Integration

Once configured, your insurance products will appear in:

1. **Test Configuration Screen**: For scope selection
2. **Test Execution**: Plans are executed in defined sequence
3. **Results Analysis**: Individual plan tracking and comparison
4. **AI Analysis**: Intelligent difference detection

## 🚀 Testing Your Configuration

After configuration:

1. **Start the platform**: `./scripts/run_dev.sh`
2. **Access frontend**: http://localhost:3000
3. **Configure test**: Select your products and plans
4. **Run test**: Execute the complete flow
5. **Verify results**: Check the analysis and comparison

## 🔍 Validation

The platform validates configuration files on startup:

- **Required Fields**: Ensures all mandatory fields are present
- **Data Types**: Validates data formats and relationships
- **Cross-references**: Ensures IDs and references are consistent

## 📝 Support

For configuration assistance:

1. **Check examples**: Review the example configurations in this guide
2. **API Documentation**: See `/docs/API_REFERENCE.md`
3. **Test Results**: Validate configurations by running test executions
4. **Community Support**: Share configurations and best practices

## 🚨 Common Issues

### Invalid Configuration

**Symptoms**: Products or environments don't appear in UI
**Solutions**: 
- Check JSON syntax using online validator
- Ensure all required fields are present
- Verify file is in correct location (`data/configs/`)
- Check file permissions

### Missing Products

**Symptoms**: Plans or categories appear empty
**Solutions**:
- Verify product mappings exist in configuration
- Check display_order values
- Ensure categories contain products with plans
- Reload configuration using API endpoint

### Authentication Errors

**Symptoms**: API calls fail with authentication errors
**Solutions**:
- Verify token fields match API requirements
- Check if tokens are valid and active
- Ensure authentication type is correct (bearer/basic)
- Test API connectivity to your insurance systems