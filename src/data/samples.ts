import { ChangeAnalysis } from '../types';

export const SAMPLE_ANALYSIS_CUSTOMER_PROFILE: ChangeAnalysis = {
  id: 'sample-cust-profile-001',
  user_id: 'guest-user',
  project_name: 'Customer Profile Management Enhancement',
  current_state: 'Customers can update their registered email address through the profile management page. The updated email address is validated and synchronized with the CRM system.',
  proposed_change: 'Customers should also be able to update their registered mobile phone number through the profile management page.',
  business_context: 'The application integrates with CRM, Identity Management, Notification Service and Customer Data Platform.',
  existing_dependencies: [
    'CRM API',
    'Customer Database',
    'OTP Service',
    'Notification Service',
    'Identity Management'
  ],
  overall_impact_score: 72,
  impact_classification: 'High',
  executive_summary: {
    change_overview: 'Extending customer self-service profile management to support mobile phone number updates, transitioning beyond single-attribute email updates to multi-factor verified contact data.',
    overall_impact: 'The proposed change has a High Impact (72/100) because it introduces personally identifiable customer data (PII), multi-factor SMS verification workflows, stringent security anti-takeover controls, and bi-directional synchronization across downstream CRM and CDP systems.',
    key_areas_affected: [
      'Customer Database Schema & Uniqueness Constraints',
      'Downstream CRM & CDP Sync Contracts',
      'OTP SMS Verification & Rate Limiting Services',
      'Account Recovery & Security Fraud Controls',
      'Cross-Channel Regression Testing'
    ],
    top_risks: [
      'Account takeover via unauthorized SIM/number reassignment without secondary verification',
      'Desynchronization or race conditions between CRM and Customer Database during concurrent profile updates',
      'SMS delivery latency or gateway outage blocking critical profile update workflows'
    ],
    recommended_next_step: 'Conduct a cross-functional stakeholder impact workshop involving Product, Solution Architecture, Security (InfoSec), and CRM Integration teams to baseline OTP verification policies and uniqueness constraints before finalizing functional specifications.'
  },
  impact_areas: [
    {
      id: 'ia-1',
      category: 'Functional Requirements',
      impact_level: 'High',
      risk_level: 'High',
      description: 'Extends profile management feature to capture, validate, verify, and store international mobile numbers.',
      reason: 'The proposed change introduces new mobile number input mask, country code selection, OTP submission modals, and multi-state error handling.',
      recommended_action: 'Draft explicit functional specifications for mobile number formats (E.164), OTP retry policies, cooldown limits, and edge case flows (duplicate numbers, unreachable devices).'
    },
    {
      id: 'ia-2',
      category: 'Business Rules',
      impact_level: 'High',
      risk_level: 'High',
      description: 'New business rules governing mobile uniqueness, change frequencies, and account linkage.',
      reason: 'Decisions required on whether mobile numbers can be shared across family accounts, maximum update attempts per 24 hours, and cooling-off periods.',
      recommended_action: 'Formalize business rules: mandate uniqueness per customer account, enforce a 24-hour sensitive transaction cooldown following number changes, and require dual confirmation.'
    },
    {
      id: 'ia-3',
      category: 'User Experience / UI',
      impact_level: 'Medium',
      risk_level: 'Low',
      description: 'Profile edit modal changes, OTP entry timer, and status feedback widgets.',
      reason: 'UI requires international dial code dropdown, real-time input formatting, a 6-digit OTP modal with resend countdown timer, and accessible validation states.',
      recommended_action: 'Create Figma prototypes for desktop and mobile web viewports; ensure WCAG AA compliance for screen reader notifications on OTP countdown expiration.'
    },
    {
      id: 'ia-4',
      category: 'Database / Data Model',
      impact_level: 'High',
      risk_level: 'High',
      description: 'Schema updates in customer entity table and audit log tables.',
      reason: 'Database requires storing normalized E.164 phone numbers, country code, verification status timestamp, and immutable audit history for compliance.',
      recommended_action: 'Add `phone_number`, `phone_country_code`, `phone_verified_at` columns with appropriate indexes, unique constraints, and schema migration scripts.'
    },
    {
      id: 'ia-5',
      category: 'APIs',
      impact_level: 'High',
      risk_level: 'High',
      description: 'Customer Profile API contract extension and new OTP generation/validation endpoints.',
      reason: 'API v2 payloads must accept phone attributes and handle new error response codes (e.g. 409 Conflict, 429 Rate Limit Exceeded).',
      recommended_action: 'Update OpenAPI / Swagger specifications for `PATCH /api/v1/customer/profile` and add endpoints `POST /api/v1/auth/otp/send` and `POST /api/v1/auth/otp/verify`.'
    },
    {
      id: 'ia-6',
      category: 'System Integrations',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'Real-time or event-driven integration with CRM, CDP, and SMS Gateway providers.',
      reason: 'Mobile updates must publish events to Kafka/SQS for downstream CRM ingestion, CDP identity resolution, and SMS dispatch.',
      recommended_action: 'Define enterprise message schema for `CustomerContactUpdated` event; establish idempotency keys and dead-letter queues (DLQ) for failed syncs.'
    },
    {
      id: 'ia-7',
      category: 'Security & Compliance',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'Heightened risk of account takeover, SIM-swap vulnerability, and data privacy (GDPR / TCPA) compliance.',
      reason: 'Mobile numbers are PII and often serve as second-factor authentication targets. Unverified updates could compromise user accounts.',
      recommended_action: 'Enforce Step-Up Authentication (verify existing email or password) before initiating phone change; send security alerts to both old email and new phone.'
    },
    {
      id: 'ia-8',
      category: 'Business Processes',
      impact_level: 'Medium',
      risk_level: 'Medium',
      description: 'Customer Support and manual identity verification escalation paths.',
      reason: 'Customers who lose access to their registered phone number or enter incorrect details will contact support.',
      recommended_action: 'Update Customer Support Standard Operating Procedures (SOPs) with an identity-proofing protocol for manual contact info updates.'
    },
    {
      id: 'ia-9',
      category: 'Reporting & Analytics',
      impact_level: 'Low',
      risk_level: 'Low',
      description: 'Tracking profile completion rates, OTP delivery success rates, and SMS costs.',
      reason: 'Business intelligence and product teams need telemetry on verification drop-offs and SMS unit costs.',
      recommended_action: 'Implement Datadog/Mixpanel analytics events: `phone_update_initiated`, `otp_sent`, `otp_verified`, `phone_update_failed`.'
    },
    {
      id: 'ia-10',
      category: 'Test Cases',
      impact_level: 'High',
      risk_level: 'High',
      description: 'Comprehensive functional test matrix across international formats and network latency scenarios.',
      reason: 'Need automated test coverage for valid/invalid phone numbers, expired OTPs, brute-force OTP attempts, and network dropouts.',
      recommended_action: 'Develop Cypress/Playwright E2E suites and integration mock suites for SMS vendor failure simulations.'
    },
    {
      id: 'ia-11',
      category: 'Regression Testing',
      impact_level: 'High',
      risk_level: 'High',
      description: 'Verification of existing email update flows, login sessions, and downstream CRM webhooks.',
      reason: 'Shared profile update controller code could introduce regressions to existing email update or password reset pipelines.',
      recommended_action: 'Execute full regression suite across user authentication, email modification, customer checkout, and notification preferences.'
    },
    {
      id: 'ia-12',
      category: 'Documentation',
      impact_level: 'Medium',
      risk_level: 'Low',
      description: 'Updates to Functional Requirements Document (FRD), API guides, and Help Center articles.',
      reason: 'Customer-facing FAQs and internal technical architecture documentation must reflect the new capabilities.',
      recommended_action: 'Update internal Confluence system architecture maps, Swagger docs, and publish user-facing Help Center guide: "How to update your phone number".'
    },
    {
      id: 'ia-13',
      category: 'Project Timeline / Delivery',
      impact_level: 'Medium',
      risk_level: 'Medium',
      description: 'Potential scope creep due to third-party SMS vendor onboarding and regulatory compliance reviews.',
      reason: 'Integrating a reliable global SMS aggregator (e.g. Twilio/Infobip) may require vendor legal reviews and budget sign-off.',
      recommended_action: 'Account for 2-week buffer in sprint plan for SMS aggregator contract setup, security review, and carrier 10DLC compliance verification.'
    },
    {
      id: 'ia-14',
      category: 'Operational Support',
      impact_level: 'Medium',
      risk_level: 'Medium',
      description: 'Monitoring SMS deliverability, gateway throttling, and telco error codes.',
      reason: 'Telco carrier filtering, invalid numbers, and routing failures require real-time alerts.',
      recommended_action: 'Configure Prometheus/PagerDuty alert thresholds for OTP failure rate > 5% and SMS gateway response time > 3000ms.'
    }
  ],
  dependencies: [
    {
      id: 'dep-1',
      dependency_name: 'OTP SMS Verification Service (e.g., Twilio/AWS SNS)',
      dependency_type: 'External Service',
      impact_level: 'Critical',
      description: 'Provides programmatic SMS dispatch and token verification with global telco routing.',
      investigation_required: 'Check vendor SLA, global deliverability rates, per-message cost modeling, and rate limit quotas.'
    },
    {
      id: 'dep-2',
      dependency_name: 'CRM System (Salesforce / HubSpot API)',
      dependency_type: 'Internal System',
      impact_level: 'High',
      description: 'Downstream repository for customer relationship records and marketing outreach.',
      investigation_required: 'Verify if CRM schema permits duplicate phone numbers and whether CRM webhook triggers outbound sales workflows.'
    },
    {
      id: 'dep-3',
      dependency_name: 'Customer Data Platform (CDP / Segment)',
      dependency_type: 'Internal System',
      impact_level: 'High',
      description: 'Unifies customer identities across omni-channel touchpoints.',
      investigation_required: 'Determine identity stitch rules: will updating phone number merge or detach anonymous web visitor profiles?'
    },
    {
      id: 'dep-4',
      dependency_name: 'Identity & Access Management (Auth0 / Keycloak)',
      dependency_type: 'Authentication Service',
      impact_level: 'High',
      description: 'Manages user sessions, JWT claims, and multi-factor authentication (MFA) credentials.',
      investigation_required: 'Check if phone number is used as an SMS MFA factor and if updating it requires re-enrolling MFA.'
    },
    {
      id: 'dep-5',
      dependency_name: 'Telecom & Privacy Regulatory Bodies (TCPA / GDPR)',
      dependency_type: 'Regulatory',
      impact_level: 'High',
      description: 'Legal standards governing automated transactional vs marketing SMS consents.',
      investigation_required: 'Confirm opt-in consent checkboxes and explicit disclaimer wording required during phone registration.'
    }
  ],
  risks: [
    {
      id: 'risk-1',
      title: 'Account Takeover via Weak Verification',
      description: 'An attacker with temporary session access updates the victim phone number to their own device, locking out the legitimate user and hijacking MFA.',
      category: 'Security',
      probability: 'Medium',
      impact: 'Critical',
      risk_level: 'Critical',
      mitigation: 'Require re-entering current password or validating an email confirmation token before applying the new mobile number. Send instant alerts to the existing email.'
    },
    {
      id: 'risk-2',
      title: 'Desynchronization Between Database and Downstream CRM',
      description: 'Network timeout during CRM API sync causes database to record updated number while CRM retains stale contact info.',
      category: 'Integration',
      probability: 'Medium',
      impact: 'High',
      risk_level: 'High',
      mitigation: 'Implement asynchronous message queue (e.g. SQS/RabbitMQ) with exponential retry, idempotency keys, and automated reconciliation cron jobs.'
    },
    {
      id: 'risk-3',
      title: 'SMS Toll Fraud / OTP Telephony Pumping',
      description: 'Malicious actors script automated requests to premium-rate international numbers, racking up thousands of dollars in telecom fees.',
      category: 'Technical',
      probability: 'High',
      impact: 'High',
      risk_level: 'High',
      mitigation: 'Implement IP-based rate limiting, Cloudflare Turnstile bot protection, geo-blocking non-serviced countries, and max 3 OTP requests per phone per hour.'
    },
    {
      id: 'risk-4',
      title: 'Duplicate Phone Number Collisions',
      description: 'Two different users attempt to register the exact same mobile number, causing primary key conflicts or cross-account data leakage.',
      category: 'Data',
      probability: 'Medium',
      impact: 'High',
      risk_level: 'High',
      mitigation: 'Apply unique database index on normalized E.164 phone string and enforce clear error feedback prompt: "This mobile number is already linked to another account."'
    },
    {
      id: 'risk-5',
      title: 'SMS Carrier Delivery Lag or Country Restrictions',
      description: 'International users experience delays up to 10 minutes or outright carrier filtering of alphanumeric sender IDs.',
      category: 'Operational',
      probability: 'Medium',
      impact: 'Medium',
      risk_level: 'Medium',
      mitigation: 'Configure secondary fallback SMS aggregator; allow fallback to email verification or voice OTP for high-latency regions.'
    }
  ],
  stakeholders: [
    {
      id: 'stk-1',
      stakeholder_name: 'Product Owner / Product Manager',
      impact_reason: 'Owns user acceptance criteria, project priorities, roadmap trade-offs, and go-to-market approval.',
      engagement_level: 'Approve'
    },
    {
      id: 'stk-2',
      stakeholder_name: 'Security & InfoSec Team',
      impact_reason: 'Account takeover threat modeling, MFA integrity, and SMS toll fraud prevention posture.',
      engagement_level: 'Approve'
    },
    {
      id: 'stk-3',
      stakeholder_name: 'Lead Solution Architect',
      impact_reason: 'Oversees distributed data consistency, message queue decoupling, and third-party SMS vendor architecture.',
      engagement_level: 'Collaborate'
    },
    {
      id: 'stk-4',
      stakeholder_name: 'CRM & Data Engineering Team',
      impact_reason: 'Manages downstream CRM payload schemas, ETL synchronization jobs, and CDP identity stitching.',
      engagement_level: 'Collaborate'
    },
    {
      id: 'stk-5',
      stakeholder_name: 'QA & Test Engineering Team',
      impact_reason: 'Must construct virtual SMS testing stubs, international validation suites, and cross-browser regression runs.',
      engagement_level: 'Collaborate'
    },
    {
      id: 'stk-6',
      stakeholder_name: 'Legal & Compliance Officer',
      impact_reason: 'Ensures adherence to TCPA, GDPR Article 6, and anti-spam opt-in regulations regarding phone communication.',
      engagement_level: 'Consult'
    },
    {
      id: 'stk-7',
      stakeholder_name: 'Customer Support / Operations Team',
      impact_reason: 'Handles frontline customer tickets when users lose SIM cards or fail OTP verification.',
      engagement_level: 'Inform'
    }
  ],
  regression_areas: [
    {
      id: 'reg-1',
      test_area: 'Existing Email Update & Validation Workflow',
      reason: 'Ensures changes to profile controller and form state do not break existing email modification logic.',
      priority: 'Critical'
    },
    {
      id: 'reg-2',
      test_area: 'User Login & Multi-Factor Authentication',
      reason: 'Validates that updating mobile numbers does not corrupt login tokens, active sessions, or MFA routing.',
      priority: 'Critical'
    },
    {
      id: 'reg-3',
      test_area: 'CRM Bi-Directional Synchronization Pipeline',
      reason: 'Confirms existing CRM contact sync continues operating without dropped records or malformed payloads.',
      priority: 'High'
    },
    {
      id: 'reg-4',
      test_area: 'Order Checkout / Transactional SMS Notifications',
      reason: 'Verifies downstream services that pull customer contact details for shipment tracking receive valid numbers.',
      priority: 'High'
    },
    {
      id: 'reg-5',
      test_area: 'Password Reset & Account Recovery Flows',
      reason: 'Verifies recovery methods continue functioning and do not default to unverified phone numbers.',
      priority: 'High'
    }
  ],
  documentation_impacts: [
    {
      id: 'doc-1',
      document_type: 'Functional Requirements Document (FRD)',
      impact_description: 'Detail E.164 formatting, OTP verification rules, rate limits, and error state matrices.',
      priority: 'Critical'
    },
    {
      id: 'doc-2',
      document_type: 'API Documentation & OpenAPI Specs',
      impact_description: 'Document new phone fields on profile endpoints and add OTP generation/verification API specs.',
      priority: 'High'
    },
    {
      id: 'doc-3',
      document_type: 'Data Dictionary & Schema Mapping',
      impact_description: 'Record new database columns (`phone_number`, `phone_country_code`, `phone_verified_at`) and CRM mapping.',
      priority: 'High'
    },
    {
      id: 'doc-4',
      document_type: 'Customer Support Knowledge Base / SOP',
      impact_description: 'Write support guide for manual customer phone updates and troubleshooting OTP delivery issues.',
      priority: 'Medium'
    },
    {
      id: 'doc-5',
      document_type: 'Security Threat Model & Privacy Impact Assessment',
      impact_description: 'Document SIM-swap defense mechanisms and GDPR/TCPA compliance audit trail specifications.',
      priority: 'High'
    }
  ],
  open_questions: [
    {
      id: 'q-1',
      question: 'Should mobile number updates require real-time OTP verification before saving to the database?',
      category: 'Security',
      priority: 'Critical'
    },
    {
      id: 'q-2',
      question: 'What is the system behavior if the mobile number is already registered to another active customer?',
      category: 'Business',
      priority: 'Critical'
    },
    {
      id: 'q-3',
      question: 'Should existing logged-in sessions on other devices be terminated when a phone number is updated?',
      category: 'Security',
      priority: 'High'
    },
    {
      id: 'q-4',
      question: 'How should the system handle downstream CRM synchronization failures (retry queue vs instant rollback)?',
      category: 'Technical',
      priority: 'High'
    },
    {
      id: 'q-5',
      question: 'Are there specific international country codes that should be restricted due to high SMS fraud risk?',
      category: 'Compliance',
      priority: 'Medium'
    },
    {
      id: 'q-6',
      question: 'Should a confirmation email notification be triggered to the original email address alerting them of the change?',
      category: 'Functional',
      priority: 'High'
    },
    {
      id: 'q-7',
      question: 'What is the maximum number of OTP resend attempts permitted within a 15-minute window?',
      category: 'Technical',
      priority: 'Medium'
    }
  ],
  checklist: {
    before_implementation: [
      { id: 'chk-1', phase: 'before_implementation', task: 'Confirm business rules on duplicate phone number handling with Product & Legal', completed: true },
      { id: 'chk-2', phase: 'before_implementation', task: 'Define E.164 phone formatting and validation library requirements (e.g. libphonenumber)', completed: true },
      { id: 'chk-3', phase: 'before_implementation', task: 'Review security implications of account takeover and draft step-up authentication flow', completed: true },
      { id: 'chk-4', phase: 'before_implementation', task: 'Finalize SMS gateway vendor selection, rate limits, and international cost projections', completed: false },
      { id: 'chk-5', phase: 'before_implementation', task: 'Align CRM and CDP data schemas with downstream engineering owners', completed: false }
    ],
    during_development: [
      { id: 'chk-6', phase: 'during_development', task: 'Update database schema with phone fields and unique constraints', completed: false },
      { id: 'chk-7', phase: 'during_development', task: 'Implement OTP dispatch and verification endpoints with rate limiting & cooldown timer', completed: false },
      { id: 'chk-8', phase: 'during_development', task: 'Build responsive UI modal with country code selector, formatted input, and countdown timer', completed: false },
      { id: 'chk-9', phase: 'during_development', task: 'Implement asynchronous message queue for CRM/CDP synchronization with exponential backoff', completed: false },
      { id: 'chk-10', phase: 'during_development', task: 'Add security alerting to notify user of phone change via registered email', completed: false }
    ],
    before_release: [
      { id: 'chk-11', phase: 'before_release', task: 'Execute end-to-end regression testing across email update, login, and checkout flows', completed: false },
      { id: 'chk-12', phase: 'before_release', task: 'Perform penetration testing and rate-limit stress test on OTP endpoints', completed: false },
      { id: 'chk-13', phase: 'before_release', task: 'Verify downstream CRM data reconciliation across staging environment', completed: false },
      { id: 'chk-14', phase: 'before_release', task: 'Publish updated Help Center documentation and train Customer Support leads', completed: false },
      { id: 'chk-15', phase: 'before_release', task: 'Set up real-time Datadog alerts for SMS delivery failures and error spikes', completed: false }
    ]
  },
  additional_considerations: [
    {
      id: 'ac-1',
      category: 'Regulatory / Compliance',
      severity: 'High',
      description: 'TCPA (Telephone Consumer Protection Act) mandates explicit consent before sending automated SMS messages in North America, with penalties up to $1,500 per violation.',
      recommended_action: 'Ensure transactional OTP disclaimers are strictly separated from marketing SMS opt-in checkboxes during phone submission.'
    },
    {
      id: 'ac-2',
      category: 'Technical Architecture',
      severity: 'Medium',
      description: 'Re-cycled phone numbers: Telecom operators routinely reassign disconnected numbers to new subscribers after 90 days.',
      recommended_action: 'Incorporate mobile network operator (MNO) subscriber status checks or verify age of SIM assignment via carrier lookups if high-value transactions are involved.'
    }
  ],
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  updated_at: new Date(Date.now() - 86400000).toISOString(),
  is_sample: true
};

export const SAMPLE_ANALYSIS_PAYMENT_GATEWAY: ChangeAnalysis = {
  id: 'sample-payment-gateway-002',
  user_id: 'guest-user',
  project_name: 'Payment Gateway Migration to Stored Credentials (SCA & 3DS 2.0)',
  current_state: 'Customers enter payment card details on checkout page for one-time payments processed through Legacy Gateway A with synchronous HTTP redirection.',
  proposed_change: 'Upgrade checkout to support tokenized Card-on-File stored credentials and Stripe 3D Secure 2.0 Strong Customer Authentication (SCA).',
  business_context: 'Subscription billing system, multi-region European and US e-commerce store with PCI-DSS Level 1 compliance requirements.',
  existing_dependencies: ['Legacy Gateway A', 'Checkout Service', 'Subscription Billing Engine', 'PCI Token Vault', 'Fraud Detection System'],
  overall_impact_score: 84,
  impact_classification: 'Critical',
  executive_summary: {
    change_overview: 'Overhaul of payment infrastructure to support PCI-compliant tokenized cards, zero-friction 3D Secure 2.0 Strong Customer Authentication (SCA), and recurring subscription billing.',
    overall_impact: 'Critical Impact (84/100) due to strict PCI-DSS regulatory compliance, financial liability shift, async payment challenge webhooks, and direct exposure to customer checkout conversion rates.',
    key_areas_affected: [
      'PCI-DSS Scope & Token Vault Integration',
      'Checkout Funnel & 3DS 2.0 Challenge Modals',
      'Async Payment Webhooks & Idempotent Order Creation',
      'Recurring Subscription Billing Lifecycle',
      'Financial Reconciliation & Refund Pipelines'
    ],
    top_risks: [
      'Drop in mobile checkout conversion rate due to unhandled 3DS challenge timeouts',
      'Double-charging or missed subscription renewals if webhook processing fails or is non-idempotent',
      'PCI compliance breach if unencrypted card data inadvertently touches application servers'
    ],
    recommended_next_step: 'Schedule an Architecture and Security Review with the Payment Gateway integration architects to validate hosted iframe tokenization (Stripe Elements) and webhook idempotency before code branch kickoff.'
  },
  impact_areas: [
    {
      id: 'ia-pg-1',
      category: 'Functional Requirements',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'Support saving cards for future use, handling frictionless vs challenge authentication, and default payment method selection.',
      reason: 'Introduces multi-step asynchronous payment intents, dynamic 3DS authentication popups, and card lifecycle management.',
      recommended_action: 'Define requirements for card management dashboard (delete, set default, update expiration) and SCA error resolution.'
    },
    {
      id: 'ia-pg-2',
      category: 'Security & Compliance',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'Strict adherence to PCI-DSS SAQ-A criteria and PSD2 SCA European mandates.',
      reason: 'Handling card tokens requires ensuring no PAN (Primary Account Number) or CVV ever touches internal servers.',
      recommended_action: 'Utilize client-side iframe tokenization SDKs to maintain minimal SAQ-A compliance scope.'
    },
    {
      id: 'ia-pg-3',
      category: 'APIs',
      impact_level: 'High',
      risk_level: 'High',
      description: 'New Payment Intents API, Setup Intents API, and secure Webhook receivers.',
      reason: 'Replaces synchronous payment capture with 2-stage authorize/capture and async webhook status callbacks.',
      recommended_action: 'Implement signed webhook listener `POST /api/webhooks/stripe` with cryptographic signature verification.'
    }
  ],
  dependencies: [
    {
      id: 'dep-pg-1',
      dependency_name: 'Stripe API / 3DS2 Authentication Server',
      dependency_type: 'External Service',
      impact_level: 'Critical',
      description: 'Processes tokenization, card issuer bank challenges, and SCA liability verification.',
      investigation_required: 'Verify bank support for biometric 3DS2 frictionless flows and timeout recovery fallback.'
    },
    {
      id: 'dep-pg-2',
      dependency_name: 'Subscription Billing Engine',
      dependency_type: 'Internal System',
      impact_level: 'Critical',
      description: 'Triggers off-session merchant-initiated transactions (MIT) using stored customer tokens.',
      investigation_required: 'Ensure mandate agreement flags are stored for recurring merchant-initiated transactions.'
    }
  ],
  risks: [
    {
      id: 'risk-pg-1',
      title: 'Checkout Abandonment on 3DS Friction',
      description: 'Customers unable to receive banking SMS OTP during checkout abandon shopping carts.',
      category: 'Functional',
      probability: 'High',
      impact: 'High',
      risk_level: 'High',
      mitigation: 'Implement frictionless flow optimizations, clear in-line instructions, and alternative payment method fallbacks (Apple Pay / Google Pay).'
    }
  ],
  stakeholders: [
    {
      id: 'stk-pg-1',
      stakeholder_name: 'Chief Information Security Officer (CISO) & PCI Auditor',
      impact_reason: 'Mandatory certification of PCI SAQ-A compliance posture and token vault architecture.',
      engagement_level: 'Approve'
    },
    {
      id: 'stk-pg-2',
      stakeholder_name: 'Finance & Revenue Accounting Team',
      impact_reason: 'Settlement batch reports, dispute/chargeback liability shift, and merchant fee reconciliation.',
      engagement_level: 'Collaborate'
    }
  ],
  regression_areas: [
    {
      id: 'reg-pg-1',
      test_area: 'One-Time Guest Checkout Workflow',
      reason: 'Ensure guest users who choose NOT to save cards can still complete seamless transactions.',
      priority: 'Critical'
    },
    {
      id: 'reg-pg-2',
      test_area: 'Automated Subscription Renewal Cron',
      reason: 'Verify off-session renewals succeed without requiring user interaction.',
      priority: 'Critical'
    }
  ],
  documentation_impacts: [
    {
      id: 'doc-pg-1',
      document_type: 'PCI DSS Compliance Attestation (SAQ-A)',
      impact_description: 'Formal audit document confirming card data boundary isolation.',
      priority: 'Critical'
    }
  ],
  open_questions: [
    {
      id: 'q-pg-1',
      question: 'How should the system handle off-session subscription renewals when a customer card requires interactive 3DS authentication?',
      category: 'Business',
      priority: 'Critical'
    }
  ],
  checklist: {
    before_implementation: [
      { id: 'chk-pg-1', phase: 'before_implementation', task: 'Complete PCI SAQ-A scope boundary review with Security team', completed: true },
      { id: 'chk-pg-2', phase: 'before_implementation', task: 'Map out 3DS2 frictionless vs challenge flow state machine', completed: false }
    ],
    during_development: [
      { id: 'chk-pg-3', phase: 'during_development', task: 'Integrate secure client-side Elements tokenization container', completed: false },
      { id: 'chk-pg-4', phase: 'during_development', task: 'Build webhook listener with signature verification and replay prevention', completed: false }
    ],
    before_release: [
      { id: 'chk-pg-5', phase: 'before_release', task: 'Perform sandbox testing with test card 3DS challenge matrices', completed: false }
    ]
  },
  additional_considerations: [],
  created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  is_sample: true
};

export const SAMPLE_ANALYSIS_SSO: ChangeAnalysis = {
  id: 'sample-sso-saml-003',
  user_id: 'guest-user',
  project_name: 'Enterprise SSO & Role-Based Access Control Migration',
  current_state: 'Enterprise users log in via standard username and password credentials stored in PostgreSQL with bcrypt hashing.',
  proposed_change: 'Allow corporate enterprise clients to authenticate via SAML 2.0 / OIDC identity providers (Okta, Azure AD) with Just-In-Time (JIT) user provisioning and SCIM user deactivation.',
  business_context: 'B2B enterprise SaaS serving Fortune 500 organizations with SOC2 Type II compliance standards.',
  existing_dependencies: ['PostgreSQL Database', 'Authentication Middleware', 'User Management Service', 'Audit Log Service'],
  overall_impact_score: 68,
  impact_classification: 'High',
  executive_summary: {
    change_overview: 'Implementation of Enterprise Single Sign-On (SSO) via SAML 2.0 / OIDC with automated user lifecycle management via SCIM protocol.',
    overall_impact: 'High Impact (68/100) due to enterprise identity federation, certificate rotation policies, session revocation handling, and RBAC attribute mapping.',
    key_areas_affected: [
      'Identity Federation & Token Validation',
      'SCIM 2.0 Directory Synchronization',
      'Database Tenant & Organization Schema',
      'Session Security & Instant De-provisioning'
    ],
    top_risks: [
      'Account lockout during IdP X.509 certificate expiry',
      'Privilege escalation via malformed SAML role claim assertions',
      'Orphaned active user sessions after IdP deactivation'
    ],
    recommended_next_step: 'Conduct an InfoSec review of SAML assertion validation and design tenant-isolated IdP configuration schemas.'
  },
  impact_areas: [
    {
      id: 'ia-sso-1',
      category: 'Functional Requirements',
      impact_level: 'High',
      risk_level: 'High',
      description: 'SP-initiated and IdP-initiated SSO authentication flows, metadata XML upload, and SAML assertion parsing.',
      reason: 'Replaces direct credential submission with SAML redirect/POST bindings and signature validation.',
      recommended_action: 'Support SAML 2.0 standard with configurable entity ID, ACS URL, and automated certificate rollover notifications.'
    },
    {
      id: 'ia-sso-2',
      category: 'Security & Compliance',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'SOC2 Type II access control compliance, cryptographic signature validation, and tenant isolation.',
      reason: 'Flaws in assertion parsing could permit unauthorized cross-tenant logins.',
      recommended_action: 'Enforce strict XML signature wrapping attack mitigations and tenant audience restriction checks.'
    }
  ],
  dependencies: [
    {
      id: 'dep-sso-1',
      dependency_name: 'Corporate Identity Providers (Okta / Azure AD / Ping)',
      dependency_type: 'External Identity Provider',
      impact_level: 'Critical',
      description: 'External identity source of truth supplying SAML assertions and user claims.',
      investigation_required: 'Confirm supported assertion encryption algorithms and claim attribute mappings.'
    }
  ],
  risks: [
    {
      id: 'risk-sso-1',
      title: 'IdP Outage Preventing Enterprise Access',
      description: 'Third-party IdP downtime locks entire client organization out of SaaS workspace.',
      category: 'Security',
      probability: 'Low',
      impact: 'Critical',
      risk_level: 'High',
      mitigation: 'Implement emergency break-glass tenant administrator email login with hardware MFA token.'
    }
  ],
  stakeholders: [
    {
      id: 'stk-sso-1',
      stakeholder_name: 'Enterprise Customer IT Administrators',
      impact_reason: 'Responsible for configuring enterprise IdP metadata, attribute maps, and testing connection.',
      engagement_level: 'Collaborate'
    }
  ],
  regression_areas: [
    {
      id: 'reg-sso-1',
      test_area: 'Standard Password & Social Login Flows',
      reason: 'Ensure non-SSO self-service workspaces continue functioning without regression.',
      priority: 'High'
    }
  ],
  documentation_impacts: [
    {
      id: 'doc-sso-1',
      document_type: 'Enterprise IT Administrator Setup Guide',
      impact_description: 'Step-by-step documentation for configuring Okta, Azure AD, and Google Workspace SAML apps.',
      priority: 'High'
    }
  ],
  open_questions: [
    {
      id: 'q-sso-1',
      question: 'Should existing password-based users under the same domain be forcibly converted to SSO or allowed dual-login?',
      category: 'Business',
      priority: 'High'
    }
  ],
  checklist: {
    before_implementation: [
      { id: 'chk-sso-1', phase: 'before_implementation', task: 'Finalize SAML 2.0 schema and attribute claim conventions', completed: true }
    ],
    during_development: [
      { id: 'chk-sso-2', phase: 'during_development', task: 'Implement ACS callback endpoint with XML signature validation', completed: false }
    ],
    before_release: [
      { id: 'chk-sso-3', phase: 'before_release', task: 'Execute end-to-end integration tests with Okta and Azure AD test tenants', completed: false }
    ]
  },
  additional_considerations: [],
  created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  is_sample: true
};

export const SAMPLE_ANALYSIS_TELEHEALTH: ChangeAnalysis = {
  id: 'sample-telehealth-004',
  user_id: 'guest-user',
  project_name: 'Patient Telehealth Video Consultation & Electronic Consent',
  current_state: 'Patients book in-person clinic appointments via patient portal. Notifications sent via email.',
  proposed_change: 'Enable virtual video consultations with integrated e-signature for HIPAA consent forms and automatic EHR medical record encounter creation.',
  business_context: 'HIPAA-regulated clinical EHR management portal with real-time video streaming, encrypted chat, and physician billing codes.',
  existing_dependencies: ['Electronic Health Records (EHR)', 'Video WebRTC Service', 'E-Signature API', 'Billing & Claims Service'],
  overall_impact_score: 79,
  impact_classification: 'High',
  executive_summary: {
    change_overview: 'Introduction of HIPAA-compliant live video telehealth sessions, digital e-consent capture, and real-time EHR medical encounter documentation.',
    overall_impact: 'High Impact (79/100) due to strict HIPAA Protected Health Information (PHI) privacy regulations, peer-to-peer WebRTC video encryption, medical liability consent tracking, and downstream billing claims generation.',
    key_areas_affected: [
      'HIPAA PHI Data Encryption & Audit Trails',
      'Real-Time WebRTC Media Streaming',
      'Electronic Signature & Legal Consent Storage',
      'EHR Clinical Encounter & Billing Integration'
    ],
    top_risks: [
      'Breach of PHI if unencrypted video telemetry or room recordings are stored on non-BAA cloud storage',
      'Patient dropouts due to browser WebRTC microphone/camera permission rejections',
      'Unsigned consent resulting in physician malpractice liability or denied insurance reimbursement'
    ],
    recommended_next_step: 'Execute Business Associate Agreements (BAAs) with WebRTC and E-Signature providers, and complete a Privacy Impact Assessment.'
  },
  impact_areas: [
    {
      id: 'ia-th-1',
      category: 'Security & Compliance',
      impact_level: 'Critical',
      risk_level: 'Critical',
      description: 'End-to-end encryption for video streaming and HIPAA audit logging of consultation timestamps.',
      reason: 'Federal healthcare regulations mandate strict access controls and encrypted transmission for clinical consults.',
      recommended_action: 'Ensure all video media servers utilize DTLS-SRTP and that audit logs capture exact join/leave timestamps.'
    }
  ],
  dependencies: [
    {
      id: 'dep-th-1',
      dependency_name: 'HIPAA-Compliant WebRTC Video Provider (e.g., Twilio Video / Daily.co)',
      dependency_type: 'External Service',
      impact_level: 'Critical',
      description: 'Streams encrypted audio/video between patient and healthcare provider.',
      investigation_required: 'Verify signed BAA contract and browser fallback support for low-bandwidth mobile connections.'
    }
  ],
  risks: [
    {
      id: 'risk-th-1',
      title: 'Consultation Conducted Without Signed Informed Consent',
      description: 'System glitch allows patient into video room before electronic signature is recorded, exposing clinic to legal liability.',
      category: 'Compliance',
      probability: 'Medium',
      impact: 'Critical',
      risk_level: 'High',
      mitigation: 'Implement strict gating logic: video room token is only minted after verifiable cryptographic signature is committed to EHR.'
    }
  ],
  stakeholders: [
    {
      id: 'stk-th-1',
      stakeholder_name: 'Clinical Operations Director & Chief Medical Officer',
      impact_reason: 'Validates clinical workflow adherence, physician scheduling, and patient care standards.',
      engagement_level: 'Approve'
    }
  ],
  regression_areas: [
    {
      id: 'reg-th-1',
      test_area: 'Existing In-Person Appointment Scheduling',
      reason: 'Ensure standard in-person booking pipelines are not disrupted by virtual appointment logic.',
      priority: 'High'
    }
  ],
  documentation_impacts: [
    {
      id: 'doc-th-1',
      document_type: 'HIPAA Compliance & Privacy Impact Assessment (PIA)',
      impact_description: 'Formal documentation verifying BAA agreements and PHI access audit logging.',
      priority: 'Critical'
    }
  ],
  open_questions: [
    {
      id: 'q-th-1',
      question: 'Should consultation session recordings be prohibited by default to minimize HIPAA retention liability?',
      category: 'Compliance',
      priority: 'Critical'
    }
  ],
  checklist: {
    before_implementation: [
      { id: 'chk-th-1', phase: 'before_implementation', task: 'Sign Business Associate Agreements (BAA) with all third-party vendors', completed: true }
    ],
    during_development: [
      { id: 'chk-th-2', phase: 'during_development', task: 'Implement consent verification gating prior to WebRTC token issuance', completed: false }
    ],
    before_release: [
      { id: 'chk-th-3', phase: 'before_release', task: 'Perform clinical trial simulation with physicians and test patients', completed: false }
    ]
  },
  additional_considerations: [],
  created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
  updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  is_sample: true
};

export const PRESET_CHANGE_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Customer Profile Mobile Update (E-Commerce)',
    project_name: 'Customer Profile Management Enhancement',
    current_state: 'Customers can update their registered email address through the profile management page. The updated email address is validated and synchronized with the CRM system.',
    proposed_change: 'Customers should also be able to update their registered mobile phone number through the profile management page with instant SMS verification.',
    business_context: 'The application integrates with CRM, Identity Management, Notification Service and Customer Data Platform.',
    existing_dependencies: ['CRM API', 'Customer Database', 'OTP Service', 'Notification Service']
  },
  {
    id: 'tpl-2',
    name: 'Payment Gateway 3DS 2.0 & Stored Cards (FinTech)',
    project_name: 'Payment Gateway Migration & Stored Credentials',
    current_state: 'Customers enter payment card details for one-time purchases through synchronous gateway redirect.',
    proposed_change: 'Enable saved credit cards (tokenized Card-on-File) and European 3D Secure 2.0 Strong Customer Authentication (SCA) with automated off-session subscription retries.',
    business_context: 'Global SaaS with recurring monthly subscriptions, strict PCI-DSS SAQ-A and PSD2 compliance requirements.',
    existing_dependencies: ['Payment Gateway', 'Subscription Engine', 'Checkout Service', 'PCI Token Vault']
  },
  {
    id: 'tpl-3',
    name: 'Single Sign-On (SSO) SAML / Okta Integration (Enterprise SaaS)',
    project_name: 'Enterprise SSO & Role-Based Access Control Migration',
    current_state: 'Enterprise users log in via standard username and password credentials stored in PostgreSQL with bcrypt hashing.',
    proposed_change: 'Allow corporate enterprise clients to authenticate via SAML 2.0 / OIDC identity providers (Okta, Azure AD) with Just-In-Time (JIT) user provisioning and SCIM user deactivation.',
    business_context: 'B2B enterprise SaaS serving Fortune 500 organizations with SOC2 Type II compliance standards.',
    existing_dependencies: ['PostgreSQL Database', 'Authentication Middleware', 'User Management Service', 'Audit Log Service']
  },
  {
    id: 'tpl-4',
    name: 'Patient Telehealth Video & Consent Workflow (Healthcare / HIPAA)',
    project_name: 'Telehealth Video Consultation & Electronic Consent',
    current_state: 'Patients book in-person clinic appointments via patient portal. Notifications sent via email.',
    proposed_change: 'Enable virtual video consultations with integrated e-signature for HIPAA consent forms and automatic EHR medical record encounter creation.',
    business_context: 'HIPAA-regulated clinical EHR management portal with real-time video streaming, encrypted chat, and physician billing codes.',
    existing_dependencies: ['Electronic Health Records (EHR)', 'Video WebRTC Service', 'E-Signature API', 'Billing & Claims Service']
  }
];
