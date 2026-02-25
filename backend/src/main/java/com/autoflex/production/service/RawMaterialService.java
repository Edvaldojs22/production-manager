package com.autoflex.production.service;

import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<RawMaterial> findAll() {
        return repository.findAll();
    }
}
