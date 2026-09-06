import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ChangeAnalysis } from '../types';

export function exportAnalysisToPDF(analysis: ChangeAnalysis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [79, 70, 229]; // Indigo 600
  const grayColor = [100, 116, 139]; // Slate 500
  const borderColor = [226, 232, 240]; // Slate 200

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ScopeGuard AI', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  doc.text('Change Impact Assessment Report', 14, 18);

  doc.setFontSize(8);
  const formattedDate = new Date(analysis.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.text(`Generated: ${formattedDate}`, pageWidth - 14, 18, { align: 'right' });

  currentY = 36;

  // Project Header
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(analysis.project_name, 14, currentY);

  currentY += 8;

  // Score & Classification Badge
  const score = analysis.overall_impact_score;
  const classification = analysis.impact_classification.toUpperCase();
  
  let badgeColor = [34, 197, 94]; // Green
  if (score >= 81 || classification === 'CRITICAL') badgeColor = [239, 68, 68]; // Red
  else if (score >= 61 || classification === 'HIGH') badgeColor = [249, 115, 22]; // Orange
  else if (score >= 41 || classification === 'MODERATE') badgeColor = [234, 179, 8]; // Yellow

  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  doc.roundedRect(14, currentY, 70, 10, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`IMPACT SCORE: ${score}/100 — ${classification}`, 18, currentY + 6.5);

  currentY += 16;

  // Executive Summary Section
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Executive Summary', 14, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  
  const overviewLines = doc.splitTextToSize(`Change Overview: ${analysis.executive_summary.change_overview}`, pageWidth - 28);
  doc.text(overviewLines, 14, currentY);
  currentY += overviewLines.length * 4.5 + 2;

  const impactLines = doc.splitTextToSize(`Assessment: ${analysis.executive_summary.overall_impact}`, pageWidth - 28);
  doc.text(impactLines, 14, currentY);
  currentY += impactLines.length * 4.5 + 2;

  const nextStepLines = doc.splitTextToSize(`Recommended Next Step: ${analysis.executive_summary.recommended_next_step}`, pageWidth - 28);
  doc.setFont('helvetica', 'bold');
  doc.text(nextStepLines, 14, currentY);
  currentY += nextStepLines.length * 4.5 + 6;

  // Change Specification Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('CURRENT STATE / EXISTING REQUIREMENT:', 18, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const currentLines = doc.splitTextToSize(analysis.current_state, pageWidth - 36);
  doc.text(currentLines.slice(0, 2), 18, currentY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('PROPOSED CHANGE:', 18, currentY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const proposedLines = doc.splitTextToSize(analysis.proposed_change, pageWidth - 36);
  doc.text(proposedLines.slice(0, 2), 18, currentY + 21);

  currentY += 30;

  // 2. Change Impact Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('2. Change Impact Matrix', 14, currentY);
  currentY += 4;

  const matrixRows = analysis.impact_areas.map(ia => [
    ia.category,
    ia.impact_level,
    ia.risk_level || ia.impact_level,
    ia.recommended_action
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Impact Area Category', 'Impact Level', 'Risk Level', 'Recommended Action']],
    body: matrixRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 24 },
      2: { cellWidth: 22 },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  // 3. Dependencies Table
  doc.addPage();
  currentY = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('3. Key Dependencies & Integrations', 14, currentY);
  currentY += 4;

  const depRows = analysis.dependencies.map(d => [
    d.dependency_name,
    d.dependency_type,
    d.impact_level,
    d.investigation_required
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Dependency Name', 'Type', 'Impact', 'Investigation Required']],
    body: depRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 20 },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // 4. Risk Analysis Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('4. Risk Analysis & Mitigations', 14, currentY);
  currentY += 4;

  const riskRows = analysis.risks.map(r => [
    r.title,
    r.category,
    `${r.probability} / ${r.impact}`,
    r.risk_level,
    r.mitigation
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Risk Title', 'Category', 'Prob / Impact', 'Risk Level', 'Mitigation Strategy']],
    body: riskRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 24 },
      2: { cellWidth: 24 },
      3: { cellWidth: 20 },
      4: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  // 5. Stakeholders & Regression Scope
  doc.addPage();
  currentY = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('5. Stakeholder Impact & Engagement', 14, currentY);
  currentY += 4;

  const stkRows = analysis.stakeholders.map(s => [
    s.stakeholder_name,
    s.engagement_level,
    s.impact_reason
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Stakeholder Role', 'Level of Engagement', 'Impact Reason']],
    body: stkRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 48, fontStyle: 'bold' },
      1: { cellWidth: 36 },
      2: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 6. Regression Testing Scope
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('6. Regression Testing Scope', 14, currentY);
  currentY += 4;

  const regRows = analysis.regression_areas.map(r => [
    r.test_area,
    r.priority,
    r.reason
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Regression Test Area', 'Priority', 'Reason for Testing']],
    body: regRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 24 },
      2: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // 7. Open Discovery Questions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('7. Critical Open Questions (Change Discovery)', 14, currentY);
  currentY += 4;

  const qRows = analysis.open_questions.map((q, i) => [
    `Q${i + 1}`,
    q.category,
    q.priority,
    q.question
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Category', 'Priority', 'Discovery Question']],
    body: qRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 12, fontStyle: 'bold' },
      1: { cellWidth: 28 },
      2: { cellWidth: 22 },
      3: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 }
  });

  // Footer for all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ScopeGuard AI — Change Impact Assessment | ${analysis.project_name} | Page ${i} of ${totalPages}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
    doc.text(
      'Generated by ScopeGuard AI',
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  // Save the PDF
  const safeFilename = analysis.project_name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
  doc.save(`ScopeGuard_Analysis_${safeFilename}.pdf`);
}
