# Loan to Value Ratio (LVR) API Document

This document describes the API endpoints for calculating

## 1. Calculate LVR

path: /api/vi/lvr

method: GET

### parameters:

#### 1.estLoanValue:

    Description: Estimated Loan Value

    Type: number

    Valid value: 80000 to 2000000

#### 2.cashOutAmt:

    Description: Cash out amount

    Type: number

    Valid value: greater than 0

#### 3.estPropValue

    Description: Estimated Property Value

    Type: number

    Valid value: 100000 to 2500000

#### 4.propValuePhy

    Description: Property Value (Physical)

    Type: number

    Valid value: greater than 0

## 2. Create LVR

path: /api/vi/lvr

method: POST

### parameters:

save as the ones in 1. Calculate LVR

plus

#### 5.evidence:

    Description: document evidence of Property Value (Physical)

    Type: file

    Valid value: documents only (mimetype is application)
