package org.zkp.backend.Domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_requests")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;

    private Integer secretThreshold;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Enumerated(EnumType.STRING)
    private VerificationResult result;

    private LocalDateTime createdAt;

    @Column(length = 2000)
    private String proofData;

    public VerificationRequest() {
        this.status = RequestStatus.PENDING;
        this.result = VerificationResult.NONE;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public User getTenant() { return tenant; }
    public void setTenant(User tenant) { this.tenant = tenant; }

    public Integer getSecretThreshold() { return secretThreshold; }
    public void setSecretThreshold(Integer secretThreshold) { this.secretThreshold = secretThreshold; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public VerificationResult getResult() { return result; }
    public void setResult(VerificationResult result) { this.result = result; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getProofData() { return proofData; }
    public void setProofData(String proofData) { this.proofData = proofData; }
}