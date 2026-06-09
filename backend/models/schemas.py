"""Pydantic schemas for FulxerPro domain."""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime, timezone
import uuid


# ============ USER ============
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=80)
    referred_by: Optional[str] = None  # referral code


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    kyc_status: str = "unverified"
    referral_code: str
    balance: float = 0.0
    created_at: str


# ============ PLAN ============
class PlanCreate(BaseModel):
    name: str
    description: str
    roi_percent: float = Field(gt=0)
    duration_days: int = Field(gt=0)
    min_amount: float = Field(gt=0)
    max_amount: float = Field(gt=0)
    risk_level: Literal["low", "medium", "high"] = "medium"
    active: bool = True


class PlanPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    roi_percent: float
    duration_days: int
    min_amount: float
    max_amount: float
    risk_level: str
    active: bool


# ============ INVESTMENT ============
class InvestmentCreate(BaseModel):
    plan_id: str
    amount: float = Field(gt=0)


class InvestmentPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    plan_id: str
    plan_name: str
    amount: float
    expected_return: float
    roi_percent: float
    duration_days: int
    status: str
    started_at: str
    matures_at: str


# ============ TRANSACTION ============
class DepositCreate(BaseModel):
    amount: float = Field(gt=0)
    method: Literal["bank_transfer", "crypto", "card"] = "bank_transfer"
    reference: Optional[str] = None


class WithdrawalCreate(BaseModel):
    amount: float = Field(gt=0)
    method: Literal["bank_transfer", "crypto"] = "bank_transfer"
    destination: str  # account number / wallet address


class TransactionPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    type: str
    amount: float
    status: str
    method: Optional[str] = None
    reference: Optional[str] = None
    destination: Optional[str] = None
    created_at: str


# ============ KYC ============
class KYCSubmit(BaseModel):
    full_legal_name: str
    date_of_birth: str
    country: str
    document_type: Literal["passport", "drivers_license", "national_id"]
    document_number: str
    address: str


# ============ ADMIN ACTIONS ============
class TransactionDecision(BaseModel):
    decision: Literal["approve", "reject"]
    note: Optional[str] = None


def new_id() -> str:
    return str(uuid.uuid4())


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def short_referral_code() -> str:
    return uuid.uuid4().hex[:8].upper()
