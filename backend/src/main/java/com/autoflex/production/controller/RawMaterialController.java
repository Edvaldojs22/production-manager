package com.autoflex.production.controller;

import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.service.RawMaterialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {
    @Autowired
    private RawMaterialService rawMaterialService;

    @GetMapping
    public ResponseEntity<Page<RawMaterial>> getAll(
            @PageableDefault(size= 3, sort = "name")Pageable pageable
            ) {
        Page<RawMaterial> materials = rawMaterialService.findAll(pageable);
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
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<RawMaterial>updateStock(@PathVariable Long id, @RequestParam Double quantity){
        RawMaterial updated = rawMaterialService.updateStock(id,quantity);
        return  ResponseEntity.ok(updated);

    }
}
