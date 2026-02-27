package com.autoflex.production.service;

import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RawMaterialService {
    @Autowired
    private RawMaterialRepository repository;


    public RawMaterial save(RawMaterial material) {
        return repository.save(material);
    }

    public void delete(Long id) {

        if (!repository.existsById(id)) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Error deleting: Raw material with ID " + id + " not found."
            );
        }

        try {
            repository.deleteById(id);
        } catch (Exception e) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete: this material is linked to an active product."
            );
        }
    }

    public RawMaterial searchByCode(String code){
        return  repository.findByCode(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Material not found with code: " + code));
    }

    public Page<RawMaterial> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }


    public  RawMaterial updateStock(Long id, Double quantityChange ){
        RawMaterial material = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,"Material with ID " + id + " not found."
                ));

        Double newStock = material.getStockQuantity() + quantityChange;

        System.out.print(newStock);
        if(newStock < 0){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,"Insufficient stock. Operation aborted."
            );
        }

        material.setStockQuantity(newStock);

        return  repository.save(material);
    }

}
