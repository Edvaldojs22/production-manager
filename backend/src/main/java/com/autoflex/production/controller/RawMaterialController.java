package com.autoflex.production.controller;

import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.repository.RawMaterialRepository;
import com.autoflex.production.service.RawMaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@CrossOrigin("*")
public class RawMaterialController {
    @Autowired
    private RawMaterialService rawMaterialService;

    @GetMapping
    public ResponseEntity<List<RawMaterial>> getAll() {
        List<RawMaterial> materials = rawMaterialService.findAll();
        return ResponseEntity.ok(materials);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<RawMaterial> getByCode(@PathVariable String code) {
        RawMaterial material = rawMaterialService.searchByCode(code);
        return ResponseEntity.ok(material);
    }

    @PostMapping
    public ResponseEntity<RawMaterial> create(@Valid  @RequestBody RawMaterial material) {
        RawMaterial savedMaterial = rawMaterialService.save(material);
        return new ResponseEntity<>(savedMaterial, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rawMaterialService.delete(id);
        return ResponseEntity.noContent().build();
<<<<<<< HEAD
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<RawMaterial>updateStock(@PathVariable Long id, @RequestParam Double quantity){
        RawMaterial updated = rawMaterialService.updateStock(id,quantity);
        return  ResponseEntity.ok(updated);
=======
>>>>>>> 603684f7b7081ae827099c392a75991993a13d2c
    }
}
