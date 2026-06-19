"""Transactional email — log-to-console fallback by default.
When SENDGRID_MODE=live, swap to real SendGrid API.
"""
import os
import logging
from typing import Optional

logger = logging.getLogger("fulxerpro.email")


def is_live() -> bool:
    return os.environ.get("SENDGRID_MODE", "log").lower() == "live" and bool(os.environ.get("SENDGRID_API_KEY"))


async def send_email(to: str, subject: str, html: str, text: Optional[str] = None) -> dict:
    sender = os.environ.get("SENDGRID_FROM", "no-reply@fulxerpro.com")
    if not is_live():
        # MOCK: log to backend stdout
        logger.info("\n========= EMAIL (mock) =========\nFrom: %s\nTo: %s\nSubject: %s\n---\n%s\n=================================",
                    sender, to, subject, text or html)
        return {"ok": True, "mode": "log"}
    # LIVE: real SendGrid call
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        message = Mail(from_email=sender, to_emails=to, subject=subject, html_content=html, plain_text_content=text)
        sg = SendGridAPIClient(os.environ["SENDGRID_API_KEY"])
        resp = sg.send(message)
        return {"ok": True, "mode": "live", "status_code": resp.status_code}
    except Exception as e:
        logger.exception("SendGrid send failed: %s", e)
        return {"ok": False, "error": str(e)}


# ============ Templates ============
def tpl_welcome(name: str) -> tuple[str, str]:
    return (
        "Welcome to FulxerPro — your account is live",
        f"<h2>Welcome, {name}.</h2><p>Your FulxerPro account is active. Complete KYC to start investing.</p>",
    )


def tpl_deposit_approved(name: str, amount: float) -> tuple[str, str]:
    return (
        "Your deposit has been credited",
        f"<p>Hi {name}, your deposit of <b>${amount:,.2f}</b> has been credited to your FulxerPro balance.</p>",
    )


def tpl_withdrawal_approved(name: str, amount: float) -> tuple[str, str]:
    return (
        "Your withdrawal has been processed",
        f"<p>Hi {name}, your withdrawal of <b>${amount:,.2f}</b> is on its way to your account.</p>",
    )


def tpl_investment_matured(name: str, plan: str, amount: float, payout: float) -> tuple[str, str]:
    return (
        f"Your {plan} investment matured",
        f"<p>Hi {name}, your {plan} investment of <b>${amount:,.2f}</b> matured. <b>${payout:,.2f}</b> has been credited to your balance.</p>",
    )
