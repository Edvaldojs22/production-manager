package com.autoflex.production.controller;


import com.autoflex.production.entity.Product;
import com.autoflex.production.service.ProductionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductionService productionService;

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        List<Product> products = productionService.listAll();
        return ResponseEntity.ok(products); // Status 200
    }
    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody Product product) {
        Product savedProduct = productionService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

<<<<<<< HEAD
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productionService.delete(id);
        return ResponseEntity.noContent().build(); // Status 204
    }


    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product product = productionService.findById(id);
        return ResponseEntity.ok(product); // Status 200
=======
    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id){
        repository.deleteById(id);
    }

    @GetMapping("{id}")
    public  Product getById(@PathVariable Long id){
        return  repository.findById(id).orElse(null);
>>>>>>> 603684f7b7081ae827099c392a75991993a13d2c
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<Map<String, Object>>> getSuggestion() {
        return ResponseEntity.ok(productionService.suggestProduction());
    }
}
