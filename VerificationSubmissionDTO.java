package org.zkp.backend.DTO;

public class VerificationSubmissionDTO {
    private String proofString;
    private boolean passed;
    private boolean denied;

    public String getProofString() { return proofString; }
    public void setProofString(String proofString) { this.proofString = proofString; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
    public boolean isDenied() {return denied;}
    public void setDenied(boolean denied) {this.denied = denied; }
}