export type ImpactLevel = 'None' | 'Low' | 'Medium' | 'Moderate' | 'High' | 'Critical' | 'Minimal';
export type RiskLevel = 'Low' | 'Medium' | 'Moderate' | 'High' | 'Critical';
export type ProbabilityLevel = 'Low' | 'Medium' | 'High';
export type EngagementLevel = 'Inform' | 'Consult' | 'Collaborate' | 'Approve';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type RiskCategory = 
  | 'Functional' 
  | 'Technical' 
  | 'Data' 
  | 'Security' 
  | 'Integration' 
  | 'Compliance' 
  | 'Operational' 
  | 'Schedule';

export type QuestionCategory = 
  | 'Business' 
  | 'Functional' 
  | 'Technical' 
  | 'Data' 
  | 'Security' 
  | 'Compliance' 
  | 'Testing';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role?: string;
  organization?: string;
  created_at: string;
}

export interface ImpactArea {
  id: string;
  category: string;
  impact_level: ImpactLevel;
  risk_level?: RiskLevel;
  description: string;
  reason: string;
  recommended_action: string;
}

export interface DependencyItem {
  id: string;
  dependency_name: string;
  dependency_type: string;
  impact_level: ImpactLevel;
  description: string;
  investigation_required: string;
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  risk_level: RiskLevel;
  mitigation: string;
}

export interface StakeholderItem {
  id: string;
  stakeholder_name: string;
  impact_reason: string;
  engagement_level: EngagementLevel;
}

export interface RegressionArea {
  id: string;
  test_area: string;
  reason: string;
  priority: PriorityLevel;
}

export interface DocumentationImpact {
  id: string;
  document_type: string;
  impact_description: string;
  priority: PriorityLevel;
}

export interface OpenQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  priority: PriorityLevel;
}

export interface ChecklistTask {
  id: string;
  phase: 'before_implementation' | 'during_development' | 'before_release';
  task: string;
  completed: boolean;
}

export interface AdditionalConsideration {
  id: string;
  category: string;
  severity: ImpactLevel;
  description: string;
  recommended_action: string;
}

export interface ExecutiveSummary {
  change_overview: string;
  overall_impact: string;
  key_areas_affected: string[];
  top_risks: string[];
  recommended_next_step: string;
}

export interface ChangeAnalysis {
  id: string;
  user_id: string;
  project_name: string;
  current_state: string;
  proposed_change: string;
  business_context?: string;
  existing_dependencies?: string[];
  overall_impact_score: number;
  impact_classification: ImpactLevel;
  executive_summary: ExecutiveSummary;
  impact_areas: ImpactArea[];
  dependencies: DependencyItem[];
  risks: RiskItem[];
  stakeholders: StakeholderItem[];
  regression_areas: RegressionArea[];
  documentation_impacts: DocumentationImpact[];
  open_questions: OpenQuestion[];
  checklist: {
    before_implementation: ChecklistTask[];
    during_development: ChecklistTask[];
    before_release: ChecklistTask[];
  };
  additional_considerations?: AdditionalConsideration[];
  created_at: string;
  updated_at: string;
  is_sample?: boolean;
}

export interface AnalysisInputPayload {
  project_name: string;
  current_state: string;
  proposed_change: string;
  business_context?: string;
  existing_dependencies?: string[];
}

export interface WhatDidWeMissPayload {
  analysis: ChangeAnalysis;
  focus_area?: string;
}

export interface DashboardMetrics {
  total_analyses: number;
  average_impact_score: number;
  high_impact_count: number;
  critical_risks_count: number;
}
