package org.zkp.backend.DTO;

public class TenantInboxDTO {
    private Long requestId;
    private String propertyName;
    private String landlordName;
    private String status;
    private String result;
    private String requestDate;

    public TenantInboxDTO(Long requestId, String propertyName, String landlordName, String status, String result, String requestDate) {
        this.requestId = requestId;
        this.propertyName = propertyName;
        this.landlordName = landlordName;
        this.status = status;
        this.result = result;
        this.requestDate = requestDate;
    }

    public String getResult() {return  result; }
    public Long getRequestId() { return requestId; }
    public String getPropertyName() { return propertyName; }
    public String getLandlordName() { return landlordName; }
    public String getStatus() { return status; }
    public String getRequestDate() { return requestDate; }
}