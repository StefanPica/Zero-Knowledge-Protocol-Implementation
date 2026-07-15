package org.zkp.backend.Repository;

import org.zkp.backend.Domain.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<VerificationRequest, Long> {
    List<VerificationRequest> findByTenantId(Long tenantId);

    List<VerificationRequest> findByPropertyLandlordId(Long landlordId);
}